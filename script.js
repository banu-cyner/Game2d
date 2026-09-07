/* =====================================================
   COIN RUSH 2D
   GAME.JS
===================================================== */


/* =====================================================
   GOOGLE APPS SCRIPT URL

   SETELAH GOOGLE SCRIPT SELESAI,
   TEMPEL URL WEB APP DI SINI.
===================================================== */

const API_URL =
    "TEMPEL_URL_GOOGLE_SCRIPT_DISINI";


/* =====================================================
   DATA PEMAIN
===================================================== */

let username = "";

let whatsapp = "";

let score = 0;

let gameTime = 30;

let gameRunning = false;

let timer = null;


/* =====================================================
   HTML ELEMENT
===================================================== */

const menuScreen =
    document.getElementById(
        "menuScreen"
    );


const gameScreen =
    document.getElementById(
        "gameScreen"
    );


const leaderboardScreen =
    document.getElementById(
        "leaderboardScreen"
    );


const usernameInput =
    document.getElementById(
        "username"
    );


const whatsappInput =
    document.getElementById(
        "whatsapp"
    );


const scoreElement =
    document.getElementById(
        "score"
    );


const timeElement =
    document.getElementById(
        "time"
    );


const menuMessage =
    document.getElementById(
        "menuMessage"
    );


const leaderboardElement =
    document.getElementById(
        "leaderboard"
    );


/* =====================================================
   CANVAS
===================================================== */

const canvas =
    document.getElementById(
        "gameCanvas"
    );


const ctx =
    canvas.getContext("2d");


/* =====================================================
   PLAYER
===================================================== */

const player = {

    x: 225,

    y: 560,

    width: 45,

    height: 45,

    speed: 7

};


/* =====================================================
   COIN
===================================================== */

const coin = {

    x: 100,

    y: 100,

    size: 30

};


/* =====================================================
   INPUT
===================================================== */

const keys = {};


/* KEYBOARD */

document.addEventListener(
    "keydown",
    function(event) {

        keys[event.key] = true;

    }
);


document.addEventListener(
    "keyup",
    function(event) {

        keys[event.key] = false;

    }
);


/* =====================================================
   START BUTTON
===================================================== */

document
    .getElementById(
        "startButton"
    )
    .addEventListener(
        "click",
        startGame
    );


/* =====================================================
   START GAME
===================================================== */

function startGame() {

    username =
        usernameInput
            .value
            .trim();


    whatsapp =
        whatsappInput
            .value
            .trim();


    /* VALIDASI */

    if (username === "") {

        showMessage(
            "Username wajib diisi!"
        );

        usernameInput.focus();

        return;

    }


    if (whatsapp === "") {

        showMessage(
            "Nomor WhatsApp wajib diisi!"
        );

        whatsappInput.focus();

        return;

    }


    /* VALIDASI NOMOR */

    const cleanPhone =
        whatsapp.replace(
            /[^0-9+]/g,
            ""
        );


    if (
        cleanPhone.length < 8
    ) {

        showMessage(
            "Nomor WhatsApp tidak valid!"
        );

        whatsappInput.focus();

        return;

    }


    /*
    Hapus pesan
    */

    menuMessage.textContent =
        "";


    /*
    RESET
    */

    score = 0;

    gameTime = 30;


    player.x =
        (canvas.width -
         player.width) / 2;


    player.y =
        canvas.height -
        player.height -
        20;


    randomCoin();


    /*
    UPDATE UI
    */

    scoreElement.textContent =
        score;


    timeElement.textContent =
        gameTime;


    /*
    PINDAH KE GAME
    */

    menuScreen.classList.add(
        "hidden"
    );


    leaderboardScreen.classList.add(
        "hidden"
    );


    gameScreen.classList.remove(
        "hidden"
    );


    /*
    GAME AKTIF
    */

    gameRunning = true;


    /*
    HENTIKAN TIMER LAMA
    */

    clearInterval(timer);


    /*
    TIMER
    */

    timer = setInterval(
        function() {

            if (!gameRunning) {
                return;
            }


            gameTime--;


            timeElement.textContent =
                gameTime;


            if (
                gameTime <= 0
            ) {

                endGame();

            }

        },
        1000
    );


    /*
    GAME LOOP
    */

    requestAnimationFrame(
        gameLoop
    );

}


/* =====================================================
   GAME LOOP
===================================================== */

function gameLoop() {

    if (!gameRunning) {

        return;

    }


    update();

    draw();


    requestAnimationFrame(
        gameLoop
    );

}


/* =====================================================
   UPDATE
===================================================== */

function update() {


    /* KIRI */

    if (
        keys["ArrowLeft"] ||
        keys["a"] ||
        keys["A"]
    ) {

        player.x -=
            player.speed;

    }


    /* KANAN */

    if (
        keys["ArrowRight"] ||
        keys["d"] ||
        keys["D"]
    ) {

        player.x +=
            player.speed;

    }


    /* ATAS */

    if (
        keys["ArrowUp"] ||
        keys["w"] ||
        keys["W"]
    ) {

        player.y -=
            player.speed;

    }


    /* BAWAH */

    if (
        keys["ArrowDown"] ||
        keys["s"] ||
        keys["S"]
    ) {

        player.y +=
            player.speed;

    }


    /* BATAS KIRI */

    if (
        player.x < 0
    ) {

        player.x = 0;

    }


    /* BATAS KANAN */

    if (
        player.x +
        player.width >
        canvas.width
    ) {

        player.x =
            canvas.width -
            player.width;

    }


    /* BATAS ATAS */

    if (
        player.y < 0
    ) {

        player.y = 0;

    }


    /* BATAS BAWAH */

    if (
        player.y +
        player.height >
        canvas.height
    ) {

        player.y =
            canvas.height -
            player.height;

    }


    /* CEK KOIN */

    if (
        isColliding(
            player,
            coin
        )
    ) {

        score += 10;


        scoreElement.textContent =
            score;


        randomCoin();

    }

}


/* =====================================================
   COLLISION
===================================================== */

function isColliding(
    player,
    coin
) {

    return (

        player.x <
        coin.x + coin.size &&

        player.x +
        player.width >
        coin.x &&

        player.y <
        coin.y + coin.size &&

        player.y +
        player.height >
        coin.y

    );

}


/* =====================================================
   DRAW
===================================================== */

function draw() {


    /*
    BACKGROUND
    */

    ctx.fillStyle =
        "#020617";


    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    /*
    GRID
    */

    ctx.strokeStyle =
        "rgba(255,255,255,0.06)";


    ctx.lineWidth = 1;


    for (
        let x = 0;
        x <= canvas.width;
        x += 50
    ) {

        ctx.beginPath();

        ctx.moveTo(
            x,
            0
        );

        ctx.lineTo(
            x,
            canvas.height
        );

        ctx.stroke();

    }


    for (
        let y = 0;
        y <= canvas.height;
        y += 50
    ) {

        ctx.beginPath();

        ctx.moveTo(
            0,
            y
        );

        ctx.lineTo(
            canvas.width,
            y
        );

        ctx.stroke();

    }


    /* =================================================
       COIN
    ================================================= */

    ctx.beginPath();


    ctx.arc(

        coin.x +
        coin.size / 2,

        coin.y +
        coin.size / 2,

        coin.size / 2,

        0,

        Math.PI * 2

    );


    ctx.fillStyle =
        "#facc15";


    ctx.fill();


    /*
    COIN BORDER
    */

    ctx.strokeStyle =
        "#ca8a04";

    ctx.lineWidth = 3;

    ctx.stroke();


    /*
    SIMBOL KOIN
    */

    ctx.fillStyle =
        "#854d0e";

    ctx.font =
        "bold 17px Arial";

    ctx.textAlign =
        "center";

    ctx.textBaseline =
        "middle";


    ctx.fillText(

        "$",

        coin.x +
        coin.size / 2,

        coin.y +
        coin.size / 2

    );


    /* =================================================
       PLAYER
    ================================================= */

    ctx.fillStyle =
        "#2563eb";


    ctx.fillRect(

        player.x,

        player.y,

        player.width,

        player.height

    );


    /*
    PLAYER BORDER
    */

    ctx.strokeStyle =
        "#93c5fd";

    ctx.lineWidth = 3;


    ctx.strokeRect(

        player.x,

        player.y,

        player.width,

        player.height

    );


    /*
    MATA
    */

    ctx.fillStyle =
        "white";


    ctx.fillRect(

        player.x + 9,

        player.y + 10,

        7,

        7

    );


    ctx.fillRect(

        player.x + 29,

        player.y + 10,

        7,

        7

    );


    /*
    MULUT
    */

    ctx.fillRect(

        player.x + 14,

        player.y + 29,

        17,

        4

    );


    ctx.textAlign =
        "left";

    ctx.textBaseline =
        "alphabetic";

}


/* =====================================================
   RANDOM COIN
===================================================== */

function randomCoin() {

    coin.x =
        Math.random() *
        (
            canvas.width -
            coin.size
        );


    coin.y =
        Math.random() *
        (
            canvas.height -
            coin.size
        );

}


/* =====================================================
   GAME OVER
===================================================== */

function endGame() {

    if (!gameRunning) {

        return;

    }


    gameRunning = false;


    clearInterval(timer);


    /*
    Tampilkan hasil
    */

    alert(

        "🎉 GAME SELESAI!\n\n" +

        "Username: " +
        username +

        "\n\nScore: " +
        score

    );


    /*
    Simpan ke database
    */

    saveScore();

}


/* =====================================================
   SAVE SCORE
===================================================== */

async function saveScore() {

    /*
    Jika API belum diisi
    */

    if (
        API_URL ===
        "TEMPEL_URL_GOOGLE_SCRIPT_DISINI"
    ) {

        console.warn(
            "Google Apps Script belum diatur."
        );

        backToMenu();

        return;

    }


    try {

        /*
        Gunakan URLSearchParams
        agar tidak terkena masalah
        preflight CORS.
        */

        const formData =
            new URLSearchParams();


        formData.append(
            "action",
            "saveScore"
        );


        formData.append(
            "username",
            username
        );


        formData.append(
            "whatsapp",
            whatsapp
        );


        formData.append(
            "score",
            score
        );


        await fetch(

            API_URL,

            {

                method: "POST",

                body: formData

            }

        );


        console.log(
            "Score dikirim ke database."
        );


    } catch (error) {

        console.error(
            "Gagal menyimpan score:",
            error
        );

    }


    /*
    Kembali ke menu
    */

    backToMenu();

}


/* =====================================================
   LEADERBOARD BUTTON
===================================================== */

document
    .getElementById(
        "leaderboardButton"
    )
    .addEventListener(
        "click",
        showLeaderboard
    );


/* =====================================================
   SHOW LEADERBOARD
===================================================== */

async function showLeaderboard() {


    menuScreen.classList.add(
        "hidden"
    );


    gameScreen.classList.add(
        "hidden"
    );


    leaderboardScreen.classList.remove(
        "hidden"
    );


    leaderboardElement.innerHTML =
        "<p>⏳ Memuat leaderboard...</p>";


    if (
        API_URL ===
        "TEMPEL_URL_GOOGLE_SCRIPT_DISINI"
    ) {

        leaderboardElement.innerHTML =
            "<p>⚠️ Google Script belum dipasang.</p>";

        return;

    }


    try {

        const response =
            await fetch(

                API_URL +
                "?action=leaderboard"

            );


        const data =
            await response.json();


        if (
            !data.success
        ) {

            throw new Error(
                data.message ||
                "Gagal mengambil data."
            );

        }


        if (
            !data.leaderboard ||
            data.leaderboard.length === 0
        ) {

            leaderboardElement.innerHTML =
                "<p>🏆 Belum ada pemain.</p>";

            return;

        }


        leaderboardElement.innerHTML =
            "";


        data.leaderboard.forEach(
            function(
                playerData,
                index
            ) {

                const row =
                    document.createElement(
                        "div"
                    );


                row.className =
                    "rank";


                const number =
                    document.createElement(
                        "div"
                    );


                number.className =
                    "rank-number";


                number.textContent =
                    "#" +
                    (index + 1);


                const name =
                    document.createElement(
                        "div"
                    );


                name.className =
                    "rank-name";


                name.textContent =
                    playerData.username;


                const playerScore =
                    document.createElement(
                        "div"
                    );


                playerScore.className =
                    "rank-score";


                playerScore.textContent =
                    Number(
                        playerData.score
                    ).toLocaleString(
                        "id-ID"
                    );


                row.appendChild(
                    number
                );


                row.appendChild(
                    name
                );


                row.appendChild(
                    playerScore
                );


                leaderboardElement
                    .appendChild(row);

            }
        );


    } catch (error) {

        console.error(
            error
        );


        leaderboardElement.innerHTML =
            "<p>❌ Gagal terhubung ke database.</p>";

    }

}


/* =====================================================
   BACK TO MENU
===================================================== */

document
    .getElementById(
        "backButton"
    )
    .addEventListener(
        "click",
        backToMenu
    );


document
    .getElementById(
        "exitGameButton"
    )
    .addEventListener(
        "click",
        exitGame
    );


/* =====================================================
   EXIT GAME
===================================================== */

function exitGame() {

    if (
        gameRunning
    ) {

        const confirmExit =
            confirm(
                "Keluar dari game?\nScore saat ini tidak disimpan."
            );


        if (!confirmExit) {

            return;

        }

    }


    gameRunning = false;


    clearInterval(timer);


    backToMenu();

}


/* =====================================================
   BACK TO MENU
===================================================== */

function backToMenu() {

    gameRunning = false;


    clearInterval(timer);


    gameScreen.classList.add(
        "hidden"
    );


    leaderboardScreen.classList.add(
        "hidden"
    );


    menuScreen.classList.remove(
        "hidden"
    );

}


/* =====================================================
   MESSAGE
===================================================== */

function showMessage(
    message
) {

    menuMessage.textContent =
        message;

}


/* =====================================================
   MOBILE CONTROL
===================================================== */

const controlButtons =
    document.querySelectorAll(
        ".control"
    );


controlButtons.forEach(
    function(button) {

        const key =
            button.dataset.key;


        /*
        TOUCH START
        */

        button.addEventListener(
            "touchstart",
            function(event) {

                event.preventDefault();

                keys[key] = true;

            },
            {
                passive: false
            }
        );


        /*
        TOUCH END
        */

        button.addEventListener(
            "touchend",
            function(event) {

                event.preventDefault();

                keys[key] = false;

            },
            {
                passive: false
            }
        );


        /*
        TOUCH CANCEL
        */

        button.addEventListener(
            "touchcancel",
            function(event) {

                event.preventDefault();

                keys[key] = false;

            },
            {
                passive: false
            }
        );


        /*
        MOUSE
        */

        button.addEventListener(
            "mousedown",
            function() {

                keys[key] = true;

            }
        );


        button.addEventListener(
            "mouseup",
            function() {

                keys[key] = false;

            }
        );


        button.addEventListener(
            "mouseleave",
            function() {

                keys[key] = false;

            }
        );

    }
);


/* =====================================================
   SELESAI
===================================================== */

console.log(
    "Coin Rush 2D berhasil dimuat."
);
