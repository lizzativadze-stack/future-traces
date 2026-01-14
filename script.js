console.log('SCRIPT LOADED');

// Simple image upload handler
const imageInputs = document.querySelectorAll('.image-input');
console.log('Found ' + imageInputs.length + ' file inputs');

imageInputs.forEach((input, idx) => {
    const container = input.closest('.image-upload-container');
    const img = container.querySelector('.placeholder-image');
    const gallery = container.closest('.image-gallery');
    const galleryId = gallery.id;
    
    // Create storage key
    const storageKey = galleryId + '_img_' + idx;
    
    // Load saved image if exists
    const saved = localStorage.getItem(storageKey);
    if (saved) {
        console.log('Loading saved image: ' + storageKey);
        img.src = saved;
    }
    
    // Make container clickable
    container.addEventListener('click', () => {
        console.log('Clicked image ' + idx + ' in ' + galleryId);
        input.click();
    });
    
    // Handle file selection
    input.addEventListener('change', function(e) {
        const file = this.files[0];
        if (!file) return;
        
        console.log('Selected: ' + file.name);
        
        const reader = new FileReader();
        reader.onload = (e) => {
            const data = e.target.result;
            console.log('Read ' + data.length + ' bytes');
            
            // Show image
            img.src = data;
            
            // Save to storage
            try {
                localStorage.setItem(storageKey, data);
                console.log('✓ SAVED: ' + storageKey);
            } catch (err) {
                console.error('SAVE ERROR: ' + err);
            }
        };
        reader.readAsDataURL(file);
    });
});

// Add image button handler
const addButtons = document.querySelectorAll('.add-image-btn');
console.log('Found ' + addButtons.length + ' add buttons');

addButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        const galleryId = btn.getAttribute('data-gallery');
        const gallery = document.getElementById(galleryId);
        
        console.log('Adding image to: ' + galleryId);
        
        const html = `
            <div class="image-upload-container">
                <img src="" alt="Image" class="placeholder-image">
                <input type="file" accept="image/*" class="image-input" style="display:none;">
                <label class="upload-label">Click to upload</label>
            </div>
        `;
        
        gallery.insertAdjacentHTML('beforeend', html);
        console.log('New container added');
        
        // Setup the new input
        const newInput = gallery.querySelector('.image-input:last-of-type');
        const newContainer = newInput.closest('.image-upload-container');
        const newImg = newContainer.querySelector('.placeholder-image');
        const newIdx = gallery.querySelectorAll('.image-upload-container').length - 1;
        const newStorageKey = galleryId + '_img_' + newIdx;
        
        newContainer.addEventListener('click', () => {
            newInput.click();
        });
        
        newInput.addEventListener('change', function(e) {
            const file = this.files[0];
            if (!file) return;
            
            const reader = new FileReader();
            reader.onload = (e) => {
                newImg.src = e.target.result;
                localStorage.setItem(newStorageKey, e.target.result);
                console.log('✓ NEW IMAGE SAVED: ' + newStorageKey);
            };
            reader.readAsDataURL(file);
        });
    });
});
