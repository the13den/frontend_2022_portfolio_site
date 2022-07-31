(() => {
    "use strict";
    function isWebp() {
        function testWebP(callback) {
            let webP = new Image;
            webP.onload = webP.onerror = function() {
                callback(2 == webP.height);
            };
            webP.src = "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
        }
        testWebP((function(support) {
            let className = true === support ? "webp" : "no-webp";
            document.documentElement.classList.add(className);
        }));
    }
    let addWindowScrollEvent = false;
    setTimeout((() => {
        if (addWindowScrollEvent) {
            let windowScroll = new Event("windowScroll");
            window.addEventListener("scroll", (function(e) {
                document.dispatchEvent(windowScroll);
            }));
        }
    }), 0);
    function initMobileMenu() {
        const header = document.querySelector(".header");
        document.addEventListener("click", openMenu);
        function openMenu(e) {
            if (!e.target.closest(".header")) document.body.classList.remove("lock");
            if (e.target.closest(".icon-menu")) {
                header.classList.toggle("_menu-open");
                document.body.classList.toggle("lock");
                header.classList.remove("_menu-closed");
                header.classList.remove("_menu-loaded");
            }
            if (!header.classList.contains("_menu-open") && !header.classList.contains("_menu-loaded")) header.classList.add("_menu-closed");
        }
    }
    initMobileMenu();
    function adaptiveSizePageScale(startWidth = 320) {
        const body = document.documentElement;
        let clientWidth = document.documentElement.clientWidth;
        let bodyComputedWidth;
        let resizeCoef;
        let resizeCoefPercents;
        if (clientWidth <= startWidth) {
            bodyComputedWidth = parseInt(getComputedStyle(body).width);
            resizeCoef = clientWidth / bodyComputedWidth;
            resizeCoefPercents = 100 * resizeCoef;
            body.style.transform = `scale(${resizeCoef})`;
            body.style.transformOrigin = `top left`;
            body.style.width = `${resizeCoefPercents}%`;
            body.style.height = `${resizeCoefPercents}%`;
        } else {
            body.style.transform = ``;
            body.style.transformOrigin = ``;
            body.style.width = ``;
            body.style.height = ``;
        }
        window.addEventListener("resize", scalePage);
        function scalePage(e) {
            clientWidth = document.documentElement.clientWidth;
            if (clientWidth <= startWidth) {
                bodyComputedWidth = parseInt(getComputedStyle(body).width);
                resizeCoef = clientWidth / bodyComputedWidth;
                resizeCoefPercents = 100 * resizeCoef;
                body.style.transformOrigin = `top left`;
                body.style.transform = `scale(${resizeCoef})`;
                body.style.width = `${resizeCoefPercents}%`;
                console.log(`${resizeCoefPercents}%`);
                body.style.height = `${resizeCoefPercents}%`;
            } else {
                body.style.transform = ``;
                body.style.transformOrigin = ``;
                body.style.width = ``;
                body.style.height = ``;
            }
        }
    }
    function firefoxAdaptiveSizePageScale(startWidth = 320) {
        let userAgent = navigator.userAgent;
        if (userAgent.includes("irefox")) adaptiveSizePageScale();
    }
    firefoxAdaptiveSizePageScale();
    new SmoothScroll('a[href*="#"]', {
        speed: 300
    });
    if (localStorage.formSent) ;
    let todayDate = new Date;
    let todayDay = todayDate.getDate();
    let todayMonth = todayDate.getMonth();
    function initForm() {
        let formButton;
        let forms = document.querySelectorAll(".feedback-form");
        let form;
        let localFormSent;
        if (localStorage.formSent) localFormSent = JSON.parse(localStorage.formSent); else localFormSent = 0;
        formSentDailyReset();
        function formSentDailyReset() {
            if (localFormSent.day != todayDay || localFormSent.month != todayMonth) localStorage.formSent = JSON.stringify({
                value: 0,
                day: todayDay,
                month: todayMonth
            });
        }
        for (let index = 0; index < forms.length; index++) {
            let form = forms[index];
            checkFormSent(form);
        }
        function checkFormSent(form) {
            if (localFormSent.value) addClassFormSent(form); else removeClassFormSent(form);
            function addClassFormSent(form) {
                form.classList.add("_form-sent");
            }
            function removeClassFormSent(form) {
                form.classList.remove("_form-sent");
            }
        }
        function validateForm(form) {
            let error = 0;
            let formReq = document.querySelectorAll("._req");
            for (let index = 0; index < formReq.length; index++) {
                const input = formReq[index];
                if (form.contains(input)) {
                    inputRemoveBlankError(input);
                    inputRemoveEmailError(input);
                    if ("" === input.value || " " === input.value) {
                        inputAddBlankError(input);
                        error++;
                    } else if (input.classList.contains("_email")) if (false == validateEmail(input)) {
                        inputAddEmailError(input);
                        error++;
                    }
                }
            }
            return error;
            function inputAddBlankError(input) {
                input.parentElement.classList.add("_blank-error");
                input.classList.add("_blank-error");
            }
            function inputRemoveBlankError(input) {
                input.parentElement.classList.remove("_blank-error");
                input.classList.remove("_blank-error");
            }
            function inputAddEmailError(input) {
                input.parentElement.classList.add("_email-error");
                input.classList.add("_email-error");
            }
            function inputRemoveEmailError(input) {
                input.parentElement.classList.remove("_email-error");
                input.classList.remove("_email-error");
            }
            function validateEmail(email) {
                var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
                var address = email.value;
                if (false == reg.test(address)) return false;
            }
        }
        document.addEventListener("click", (function(e) {
            if (e.target.closest(".feedback-form__button")) {
                e.preventDefault();
                formButton = e.target.closest(".feedback-form__button");
                form = formButton.closest(".feedback-form");
                let error = validateForm(form);
                if (0 === error) {
                    let formData = new FormData(form);
                    let xhr = new XMLHttpRequest;
                    xhr.open("POST", "https://script.google.com/macros/s/AKfycbwz2VYI8q092-TvasLvhEn3cdKaBFpNYFyVwFUXzqea2kvjctVC5cXlda_eIaa9ZOSF/exec");
                    xhr.send(formData);
                    form.classList.add("_form-sending");
                    xhr.onload = function() {
                        if (200 != xhr.status) {
                            form.classList.remove("_form-sending");
                            alert(`Ошибка Отравки`);
                        } else {
                            form.classList.remove("_form-sending");
                            localStorage.formSent = JSON.stringify({
                                value: 1,
                                day: todayDay,
                                month: todayMonth
                            });
                            localFormSent = JSON.parse(localStorage.formSent);
                            checkFormSent(form);
                        }
                    };
                }
            }
        }));
    }
    initForm();
    window["FLS"] = true;
    isWebp();
})();