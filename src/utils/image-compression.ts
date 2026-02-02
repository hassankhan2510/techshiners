export async function compressImage(file: File, quality = 0.7, maxWidth = 1200): Promise<File> {
    // If it's not an image, return original
    if (!file.type.startsWith('image/')) return file
    // If it's already small (< 500KB), return original
    if (file.size < 500 * 1024) return file

    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = (event) => {
            const img = new Image()
            img.src = event.target?.result as string
            img.onload = () => {
                const canvas = document.createElement('canvas')
                let width = img.width
                let height = img.height

                // Resize logic
                if (width > maxWidth) {
                    height = Math.round((height * maxWidth) / width)
                    width = maxWidth
                }

                canvas.width = width
                canvas.height = height
                const ctx = canvas.getContext('2d')

                if (!ctx) {
                    resolve(file)
                    return
                }

                // Draw and Compress
                ctx.fillStyle = 'white' // Fix for transparency converting to black in JPEGs
                ctx.fillRect(0, 0, width, height)
                ctx.drawImage(img, 0, 0, width, height)

                canvas.toBlob((blob) => {
                    if (!blob) {
                        resolve(file)
                        return
                    }
                    // Force convert to JPEG for better compression
                    const newName = file.name.replace(/\.[^/.]+$/, "") + ".jpg"
                    const compressedFile = new File([blob], newName, {
                        type: 'image/jpeg',
                        lastModified: Date.now(),
                    })

                    console.log(`Compressed: ${(file.size / 1024).toFixed(2)}KB -> ${(compressedFile.size / 1024).toFixed(2)}KB`)
                    resolve(compressedFile)
                }, 'image/jpeg', quality)
            }
            img.onerror = (err) => resolve(file) // Fallback to original
        }
        reader.onerror = (err) => resolve(file) // Fallback
    })
}
