/* =========================================
   Science with Prof Marwa
   SCRIPT.JS
   ========================================= */


/* =========================================
   1. مواقع التواصل
   ========================================= */

const socialButton = document.getElementById("socialButton");
const socialIcon = document.getElementById("socialIcon");
const socialText = document.getElementById("socialText");
const socialDots = document.querySelectorAll(".social-dot");

const socialPlatforms = [

    {
        name: "Telegram",

        icon: `
        <svg viewBox="0 0 24 24"
             width="28"
             height="28"
             fill="currentColor">

            <path d="M21.9 3.2 2.8 10.6c-1.3.5-1.3 1.3-.2 1.6l4.9 1.5 1.9 5.9c.2.6.4.6.8.3l2.8-2.7 5.8 4.3c1.1.6 1.9.3 2.2-1l3.1-14.7c.4-1.4-.5-2-2-1.6z"/>
        </svg>
        `,

        url: "https://t.me/sciencesmarwa"
    },


    {
        name: "Instagram",

        icon: `
        <svg viewBox="0 0 24 24"
             width="28"
             height="28"
             fill="none"
             stroke="currentColor"
             stroke-width="2">

            <rect x="3"
                  y="3"
                  width="18"
                  height="18"
                  rx="5"/>

            <circle cx="12"
                    cy="12"
                    r="4"/>

            <circle cx="17.5"
                    cy="6.5"
                    r="1"
                    fill="currentColor"
                    stroke="none"/>
        </svg>
        `,

        url: "https://www.instagram.com/marwa_prof_sciences?igsh=MjF1ODc3YWRwMmc5"
    },


    {
        name: "Facebook",

        icon: `
        <svg viewBox="0 0 24 24"
             width="28"
             height="28"
             fill="currentColor">

            <path d="M14 8h3V4h-3c-3.3 0-5 2-5 5v3H6v4h3v8h4v-8h3.2l.8-4H13V9c0-.7.3-1 1-1z"/>
        </svg>
        `,

        url: "https://www.facebook.com/share/1EsTEQ35dC/"
    }

];


let currentPlatform = 0;


function changeSocialButton() {

    if (!socialButton || !socialIcon || !socialText) {
        return;
    }

    const platform =
        socialPlatforms[currentPlatform];

    socialIcon.innerHTML =
        platform.icon;

    socialText.textContent =
        "زورونا على " + platform.name;

    socialButton.href =
        platform.url;


    socialDots.forEach((dot, index) => {

        dot.classList.toggle(
            "active",
            index === currentPlatform
        );

    });


    currentPlatform++;

    if (
        currentPlatform >=
        socialPlatforms.length
    ) {

        currentPlatform = 0;

    }

}


changeSocialButton();


setInterval(
    changeSocialButton,
    2000
);

