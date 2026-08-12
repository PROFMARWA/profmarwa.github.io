const socialButton = document.getElementById("socialButton");
const socialIcon = document.getElementById("socialIcon");
const socialText = document.getElementById("socialText");

const socialPlatforms = [
    {
        name: "Telegram",
        icon: "📚",
        url: "https://t.me/sciencesmarwa"
    },
    {
        name: "Instagram",
        icon: "💡",
        url: "https://www.instagram.com/marwa_prof_sciences?igsh=MjF1ODc3YWRwMmc5"
    },
    {
        name: "Facebook",
        icon: 📌"",
        url: "https://www.facebook.com/share/1EsTEQ35dC/"
    }
];

let currentPlatform = 0;

function changeSocialButton() {

    const platform = socialPlatforms[currentPlatform];

    socialIcon.innerHTML = platform.icon;
    socialText.textContent = "زورونا على " + platform.name;
    socialButton.href = platform.url;

    currentPlatform++;

    if (currentPlatform >= socialPlatforms.length) {
        currentPlatform = 0;
    }
}

changeSocialButton();

setInterval(changeSocialButton, 2000);