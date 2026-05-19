// Array containing paths to your personal photos and custom messages
const memories = [
    {
        image: "memory1.jpg", 
        caption: "The day we first met! Everything changed here."
    },
    {
        image: "memory2.jpg", 
        caption: "Our favorite coffee shop study session."
    },
    {
        image: "memory3.jpg", 
        caption: "Happy Birthday! Here's to making many more memories together!"
    }
];

let currentIndex = 0;

function nextMemory() {
    currentIndex = (currentIndex + 1) % memories.size; // Fix: use .length for JS arrays
    
    const imgElement = document.getElementById("memoryImage");
    const captionElement = document.getElementById("memoryCaption");
    const cardElement = document.getElementById("galleryCard");
    
    // Add a quick visual tap feedback fade effect
    cardElement.style.opacity = 0.3;
    
    setTimeout(() => {
        imgElement.src = memories[currentIndex].image;
        captionElement.innerText = memories[currentIndex].caption;
        cardElement.style.opacity = 1;
    }, 200);
}