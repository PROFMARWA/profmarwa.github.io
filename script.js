const socialButton = document.getElementById("socialButton");
const socialIcon = document.getElementById("socialIcon");
const socialText = document.getElementById("socialText");

const socialPlatforms = [
    {
        name: "Telegram",
        icon: "✈️",
        url: "#"
    },
    {
        name: "Instagram",
        icon: "📸",
        url: "#"
    },
    {
        name: "Facebook",
        icon: "🔵",
        url: "#"
    }
];

let currentPlatform = 0;

function changeSocialButton() {

    const platform = socialPlatforms[currentPlatform];

    socialIcon.textContent = platform.icon;
    socialText.textContent = "زورونا على " + platform.name;
    socialButton.href = platform.url;

    currentPlatform++;

    if (currentPlatform >= socialPlatforms.length) {
        currentPlatform = 0;
    }
}

changeSocialButton();

setInterval(changeSocialButton, 2000);