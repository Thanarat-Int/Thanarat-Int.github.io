import re

# Read the file
with open(r'e:\Projects\Portfolio\thanarat-portfolio\index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Pattern to match the entire modal content div
pattern = r'(<div class="text-center">)(.*?)(</div>\s*</div>\s*</div>\s*\s*<!-- Work Experience)'

# Replacement content
replacement = r'''\1
                    <div class="w-16 h-16 bg-cyan-500/10 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                        <i class="fa-solid fa-file-arrow-down text-3xl text-cyan-400"></i>
                    </div>
                    <h3 class="text-3xl font-bold text-white mb-4">Need a little encouragement 🥺</h3>
                    
                    <p class="text-gray-300 mb-8 leading-relaxed text-lg">
                        "I poured my heart into building this portfolio to show my true passion and potential for this field. If you download my resume... <br>
                        <span class="text-cyan-300 font-semibold">please consider giving me a chance to join your team.</span> <br>
                        I promise to dedicate myself and create real impact for the team!" ❤️🔥
                    </p>

                    <div class="flex gap-4 justify-center">
                        <button id="resume-cancel-btn" class="px-6 py-3 rounded-full border border-gray-600 text-gray-400 hover:bg-gray-800 transition-colors text-base font-medium">
                            Maybe Later
                        </button>
                        <a href="assets/Resume Thanarat.C (ENG).pdf" download id="resume-confirm-btn" class="px-8 py-3 rounded-full bg-cyan-500 text-black font-bold hover:bg-cyan-400 shadow-lg hover:shadow-cyan-500/30 transition-all text-base">
                            Download Now! 🚀
                        </a>
                    </div>
                </div>
            </div>
        </div>

\3'''

# Replace
content = re.sub(pattern, replacement, content, flags=re.DOTALL)

# Write back
with open(r'e:\Projects\Portfolio\thanarat-portfolio\index.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("✅ Successfully updated Resume Modal to English-only!")
