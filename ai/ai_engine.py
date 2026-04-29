import os
import sys

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


# ---------------- FACE EXTRACTION ----------------
def extract_faces(image_path):
    img = cv2.imread(image_path)
    if img is None:
        return []
    img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    faces = mtcnn(img_rgb)
    if faces is None:
        return []
    return faces


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

    for img_name in os.listdir(folder_path):
        path = os.path.join(folder_path, img_name)
        faces = extract_faces(path)
        for face in faces:
            emb = get_embedding(face)
            embeddings.append(emb)
            image_paths.append(path)

    if len(embeddings) == 0:
        return None, None

    embeddings = np.array(embeddings).astype("float32")
    faiss.normalize_L2(embeddings)
    index = faiss.IndexFlatIP(embeddings.shape[1])
    index.add(embeddings)

    return index, image_paths


# ---------------- SEARCH ----------------
def search(query_img, dataset_path, top_k=20, threshold=0.6):
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