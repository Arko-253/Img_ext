import os
import sys
import signal

# Print immediately so we know the script started
print("AI engine started", flush=True)
sys.stderr.write(f"Python: {sys.version}\n")
sys.stderr.flush()

import json
import cv2
import torch
import numpy as np
import faiss
from facenet_pytorch import MTCNN, InceptionResnetV1

sys.stderr.write("All imports successful\n")
sys.stderr.flush()

# ---------------- DEVICE ----------------
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
sys.stderr.write(f"Device: {device}\n")
sys.stderr.flush()

# ---------------- MODELS ----------------
# pretrained weights are already downloaded in Docker image
mtcnn = MTCNN(keep_all=True, device=device)
model = InceptionResnetV1(pretrained='vggface2').eval().to(device)

sys.stderr.write("Models loaded\n")
sys.stderr.flush()


# ---------------- TIMEOUT HANDLER ----------------
def timeout_handler(signum, frame):
    raise TimeoutError("Image processing timed out")


# ---------------- FACE EXTRACTION ----------------
def extract_faces(image_path):
    signal.signal(signal.SIGALRM, timeout_handler)
    signal.alarm(10)  # 10 second timeout per image
    try:
        img_array = np.fromfile(image_path, dtype=np.uint8)
        img = cv2.imdecode(img_array, cv2.IMREAD_COLOR)
        
        if img is None:
            signal.alarm(0)
            return []
        
        # Resize large images to speed up MTCNN
        h, w = img.shape[:2]
        if max(h, w) > 1024:
            scale = 1024 / max(h, w)
            img = cv2.resize(img, (int(w*scale), int(h*scale)))
        
        img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
        faces = mtcnn(img_rgb)
        signal.alarm(0)  # cancel timeout
        
        if faces is None:
            return []
        
        return faces
    except TimeoutError:
        sys.stderr.write(f"TIMEOUT skipping: {image_path}\n")
        sys.stderr.flush()
        signal.alarm(0)
        return []


# ---------------- EMBEDDING ----------------
def get_embedding(face_tensor):
    face_tensor = face_tensor.unsqueeze(0).to(device)
    with torch.no_grad():
        emb = model(face_tensor)
    return emb.cpu().numpy()[0]


# ---------------- BUILD TEMP DATABASE ----------------
def build_temp_database(folder_path):
    embeddings = []
    image_paths = []
    
    all_files = os.listdir(folder_path)
    sys.stderr.write(f"Dataset files count: {len(all_files)}\n")
    sys.stderr.flush()

    for i, img_name in enumerate(all_files):
        path = os.path.join(folder_path, img_name)
        sys.stderr.write(f"Processing {i+1}/{len(all_files)}: {img_name}\n")
        sys.stderr.flush()
        
        faces = extract_faces(path)
        sys.stderr.write(f"  Faces found: {len(faces)}\n")
        sys.stderr.flush()
        
        for face in faces:
            emb = get_embedding(face)
            embeddings.append(emb)
            image_paths.append(path)

    sys.stderr.write(f"Total embeddings: {len(embeddings)}\n")
    sys.stderr.flush()

    if len(embeddings) == 0:
        return None, None

    embeddings = np.array(embeddings).astype("float32")
    faiss.normalize_L2(embeddings)
    index = faiss.IndexFlatIP(embeddings.shape[1])
    index.add(embeddings)

    return index, image_paths


# ---------------- SEARCH ----------------
def search(query_img, dataset_path, top_k=20, threshold=0.6):
    sys.stderr.write(f"Reading query image: {query_img}\n")
    sys.stderr.flush()
    
    # cv2.imread fails on files without extensions — force read as image
    img_array = np.fromfile(query_img, dtype=np.uint8)
    img = cv2.imdecode(img_array, cv2.IMREAD_COLOR)
    
    sys.stderr.write(f"Query image shape: {img.shape if img is not None else 'NONE - failed to read'}\n")
    sys.stderr.flush()
    
    if img is None:
        sys.stderr.write("ERROR: Could not read query image\n")
        sys.stderr.flush()
        print(json.dumps([]))
        sys.exit(0)
    
    index, image_paths = build_temp_database(dataset_path)

    if index is None:
        return []

    results = set()
    query_faces = extract_faces(query_img)

    for face in query_faces:
        q_emb = get_embedding(face).astype("float32")
        q_emb = np.expand_dims(q_emb, axis=0)
        faiss.normalize_L2(q_emb)
        distances, indices = index.search(q_emb, top_k)

        for idx, score in zip(indices[0], distances[0]):
            if score >= threshold:
                results.add(image_paths[idx])

    return list(results)


# ---------------- MAIN ----------------
if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python ai_engine.py <query_img> <dataset_folder>")
        sys.exit(1)

    query_img = sys.argv[1]
    dataset_path = sys.argv[2]

    sys.stderr.write(f"Query: {query_img}\n")
    sys.stderr.write(f"Dataset: {dataset_path}\n")
    sys.stderr.flush()

    results = search(query_img, dataset_path)

    sys.stderr.write(f"Results found: {len(results)}\n")
    sys.stderr.flush()

    print(json.dumps(results))