<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";

const query = ref(null);
const dataset = ref(null);
const loading = ref(false);

// Intentional imperfection: random subtle transforms
const getRandomOffset = () => Math.random() * 2 - 1; // -1 to 1px
const getRandomRotation = () => (Math.random() * 0.6 - 0.3); // -0.3 to 0.3deg

const handleSearch = async () => {
  if (!query.value || !dataset.value) {
    alert("Upload both files");
    return;
  }

  const formData = new FormData();
  formData.append("query", query.value);
  formData.append("dataset", dataset.value);

  try {
    loading.value = true;

    const res = await axios.post(
      "http://localhost:5000/search",
      formData,
      { responseType: "blob" }
    );

    const url = window.URL.createObjectURL(new Blob([res.data]));
    const a = document.createElement("a");
    a.href = url;
    a.download = "results.zip";
    a.click();

  } catch (err) {
    console.error(err);
    alert("Error occurred");
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="min-h-screen overflow-hidden relative" style="font-family: 'Doto', sans-serif;">
    
    <!-- LAYERED BACKGROUND SYSTEM -->
    <!-- Layer 1: Base dark gradient -->
    <div class="fixed inset-0 pointer-events-none z-0" style="
      background: radial-gradient(ellipse at center, #1a0a0a 0%, #120807 50%, #0f0505 100%);
    "></div>

    <!-- Layer 2: Film grain overlay -->
    <div class="fixed inset-0 pointer-events-none z-0" style="
      background-image: 
        url('data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22300%22 height=%22300%22><filter id=%22grain%22><feTurbulence type=%22fractalNoise%22 baseFrequency=%222%22 numOctaves=%224%22/><feColorMatrix type=%22saturate%22 values=%220.3%22/></filter><rect width=%22300%22 height=%22300%22 fill=%22%23000000%22 filter=%22url(%23grain)%22/></svg>');
      opacity: 0.04;
    "></div>

    <!-- Layer 3: Paper texture -->
    <div class="fixed inset-0 pointer-events-none z-0" style="
      background-image: url('data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22400%22 height=%22400%22><filter id=%22paper%22><feTurbulence type=%22fractalNoise%22 baseFrequency=%220.04%22 numOctaves=%225%22 seed=%222%22/><feDisplacementMap in=%22SourceGraphic%22 in2=%22paper%22 scale=%2215%22 xChannelSelector=%22R%22 yChannelSelector=%22G%22/></filter><rect width=%22400%22 height=%22400%22 fill=%22%23ffffff%22 filter=%22url(%23paper)%22 opacity=%220.03%22/></svg>');
      opacity: 0.02;
    "></div>

    <!-- Layer 4: Soft radial glow behind headline (red tint) -->
    <div class="fixed top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 pointer-events-none z-0" style="
      background: radial-gradient(circle, rgba(255, 46, 77, 0.08) 0%, transparent 70%);
      filter: blur(80px);
    "></div>

    <!-- Layer 5: Vignette edge effect -->
    <div class="fixed inset-0 pointer-events-none z-0" style="
      background: radial-gradient(ellipse at center, transparent 30%, rgba(0, 0, 0, 0.3) 100%);
      box-shadow: inset 0 0 120px 40px rgba(0, 0, 0, 0.2);
    "></div>

    <!-- CONTENT -->
    <div class="relative z-10">
      <!-- Header -->
      <div class="backdrop-blur-sm sticky top-0 z-50" style="background-color: rgba(18, 8, 7, 0.92); border-bottom: 1px solid rgba(255, 46, 77, 0.2);">
        <div class="max-w-7xl mx-auto px-4 md:px-6 py-4 md:py-5 flex justify-between items-center">
          <div class="flex items-center gap-2">
            <h1 class="text-2xl md:text-3xl font-bold" style="font-family: 'Sekuya', sans-serif; color: #ff2e4d; letter-spacing: -1px;">
              Picfin
            </h1>
          </div>
          <div class="text-xs md:text-sm" style="color: rgba(245, 245, 245, 0.4);">
            find your vibe
          </div>
        </div>
      </div>

      <!-- Main Content -->
      <div class="max-w-6xl mx-auto px-4 md:px-6 py-12 md:py-20">
        
        <!-- Hero Section -->
        <div class="mb-16 md:mb-24 relative">
          <!-- Intentional offset on headline -->
          <h2 class="text-5xl md:text-7xl lg:text-8xl font-bold leading-none mb-6 md:mb-8" style="
            font-family: 'Sekuya', sans-serif;
            color: #f5f5f5;
            letter-spacing: -2px md:-3px;
            transform: translateX(${getRandomOffset()}px) translateY(${getRandomOffset()}px) rotate(${getRandomRotation()}deg);
            text-shadow: 0 2px 20px rgba(255, 46, 77, 0.15);
            line-height: 1.1;
          ">
            Lost in a Sea<br/>of Photos?
          </h2>
          
          <p class="text-base md:text-lg max-w-2xl leading-relaxed" style="
            color: rgba(245, 245, 245, 0.6);
            letter-spacing: 0.5px;
            font-weight: 300;
            transform: translateX(${getRandomOffset() * 0.5}px);
          ">
            Just drop your photo. We'll find you in all the event chaos. No endless scrolling. No AI vibes. Just your moment.
          </p>
        </div>

        <!-- Upload Cards Grid - Minimal, Raw Style -->
        <div class="grid md:grid-cols-2 gap-6 md:gap-12 mb-12 md:mb-20" style="transform: translateY(${getRandomOffset() * 0.5}px); margin-top: 40px md:margin-top 60px;">
          
          <!-- Query Card -->
          <div class="group cursor-pointer transition-all duration-500 card" style="
            transform: translateX(${getRandomOffset()}px) translateY(${getRandomOffset()}px) rotate(${getRandomRotation()}deg);
          ">
            <div class="relative rounded-lg overflow-hidden border border-zinc-800" style="background-color: rgba(20, 10, 8, 0.7); backdrop-filter: blur(10px);">
              <!-- Inner grain overlay -->
              <div class="absolute inset-0 pointer-events-none opacity-[0.03]" style="
                background-image: url('data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22200%22 height=%22200%22><filter id=%22grain2%22><feTurbulence type=%22fractalNoise%22 baseFrequency=%222.5%22 numOctaves=%224%22/></filter><rect width=%22200%22 height=%22200%22 fill=%22%23ff2e4d%22 filter=%22url(%23grain2)%22/></svg>');
              "></div>

              <div class="p-6 md:p-10 relative z-10">
                <h3 class="text-xl md:text-2xl font-bold mb-2" style="font-family: 'Sekuya', sans-serif; color: #f5f5f5;">
                  Your Face
                </h3>
                <p class="mb-6 md:mb-8 text-xs md:text-sm" style="color: rgba(245, 245, 245, 0.5);">
                  Pick your best angle
                </p>

                <label class="block cursor-pointer">
                  <div class="bg-zinc-900/40 border border-dashed border-zinc-700 rounded-lg p-6 md:p-10 text-center hover:border-zinc-600 transition-all duration-300 group-hover:bg-zinc-900/60">
                    <input type="file" class="hidden" @change="e => query = e.target.files[0]" />
                    <div class="space-y-3">
                      <p class="text-2xl md:text-3xl">⬆️</p>
                      <p class="text-white text-xs md:text-sm font-medium">Click or drag</p>
                      <p v-if="query" class="text-white font-medium text-xs pt-3 border-t border-zinc-700" style="color: #ff2e4d; word-break: break-all;">
                        ✓ {{ query.name }}
                      </p>
                    </div>
                  </div>
                </label>
              </div>
            </div>
          </div>

          <!-- Dataset Card -->
          <div class="group cursor-pointer transition-all duration-500 card" style="
            transform: translateX(${getRandomOffset() * -1}px) translateY(${getRandomOffset()}px) rotate(${getRandomRotation()}deg);
          ">
            <div class="relative rounded-lg overflow-hidden border border-zinc-800" style="background-color: rgba(20, 10, 8, 0.7); backdrop-filter: blur(10px);">
              <!-- Inner grain overlay -->
              <div class="absolute inset-0 pointer-events-none opacity-[0.03]" style="
                background-image: url('data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22200%22 height=%22200%22><filter id=%22grain3%22><feTurbulence type=%22fractalNoise%22 baseFrequency=%222.5%22 numOctaves=%224%22/></filter><rect width=%22200%22 height=%22200%22 fill=%22%23ff2e4d%22 filter=%22url(%23grain3)%22/></svg>');
              "></div>

              <div class="p-6 md:p-10 relative z-10">
                <h3 class="text-xl md:text-2xl font-bold mb-2" style="font-family: 'Sekuya', sans-serif; color: #f5f5f5;">
                  Event Album
                </h3>
                <p class="mb-6 md:mb-8 text-xs md:text-sm" style="color: rgba(245, 245, 245, 0.5);">
                  All the pics from that night
                </p>

                <label class="block cursor-pointer">
                  <div class="bg-zinc-900/40 border border-dashed border-zinc-700 rounded-lg p-6 md:p-10 text-center hover:border-zinc-600 transition-all duration-300 group-hover:bg-zinc-900/60">
                    <input type="file" class="hidden" @change="e => dataset = e.target.files[0]" />
                    <div class="space-y-3">
                      <p class="text-2xl md:text-3xl">⬆️</p>
                      <p class="text-white text-xs md:text-sm font-medium">Click or drag (ZIP)</p>
                      <p v-if="dataset" class="text-white font-medium text-xs pt-3 border-t border-zinc-700" style="color: #ff2e4d; word-break: break-all;">
                        ✓ {{ dataset.name }}
                      </p>
                    </div>
                  </div>
                </label>
              </div>
            </div>
          </div>

        </div>

        <!-- Search Button -->
        <div class="flex justify-center mb-16 md:mb-24">
          <button
            @click="handleSearch"
            :disabled="loading"
            class="relative px-8 md:px-12 py-4 md:py-5 text-base md:text-lg font-bold rounded-lg transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed group hover:scale-110 touch-manipulation"
            style="
              font-family: 'Sekuya', sans-serif;
              background-color: #ff2e4d;
              color: #120807;
              letter-spacing: -0.5px;
              min-height: 48px;
            ">
            
            <span v-if="loading">searching...</span>
            <span v-else>find me</span>
          </button>
        </div>

        <!-- Footer -->
        <div class="text-center mt-16 md:mt-24 pb-6 md:pb-8">
          <p class="text-xs md:text-sm" style="color: rgba(245, 245, 245, 0.3); letter-spacing: 2px;">
            no scrolling. no spam. just you.
          </p>
        </div>

      </div>
    </div>

  </div>
</template>

<style scoped>
* {
  font-family: 'Doto', sans-serif;
}

[style*="font-family: 'Sekuya'"] {
  font-family: 'Sekuya', sans-serif;
}

/* Subtle grain animation for pseudo-texture */
@keyframes grain {
  0%, 100% { transform: translate(0, 0); }
  50% { transform: translate(-2px, 2px); }
}

/* Ensure text visibility over textured background */
button {
  font-feature-settings: "ss01";
}
</style>