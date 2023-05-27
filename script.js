/* Default f */

function d() {
	document.documentElement.className = "dark_theme";
	document.getElementById("navpunti").innerHTML = "Streak: " + p;
}

/* Theme Change f */

function tchange() {
	var c = document.getElementById("circle");
	if(c.style.animationName == "") { // Button in default position
		c.style.animationName = "tchangel";
        change_th(1);
	} else {
		if(c.style.animationName == "tchangel") { // Button on dark position
			c.style.animationName = "tchanged";
			change_th(0);
		} else {
			if(c.style.animationName == "tchanged") { // Button on light position
				c.style.animationName = "tchangel";
				change_th(1);
			}
		}
	}
}

/* Change Theme (Dark = 0, Light = 1) */

function change_th(theme) {
	var root = document.documentElement;
	if(theme == 1) {
		root.className = "light_theme";
	} else {
		root.className = "dark_theme";
	}
}

/* On-Screen Keyboard */

let parola;
let lettere = [];
fetch('5letters.txt').then(response => response.text()).then(data => {
	const parole = data.split('\n').filter(Boolean);
	const count = parole.length;
	const rand = Math.floor(Math.random() * count);
	parola = parole[rand].toUpperCase();
	for(let i = 0; i <= 5; i++) {
		lettere[i] = parola.substr(i, 1);
	}
});
c = 0;
ra = 0;
r = 1;
ent = 0;

$('button').on('click', function() {
	event.preventDefault(); // No Refresh
	var value = $(this).val(); // Clicked Letter

    /* If at the end of the row user click ENTER: ent=1 */

    if(c%5==0 && value == "ENT") 
        ent = 1;

    /* If user try to write at the start of a new row block it if ent was not pressed */

    if(c%5==0 && c>1) {
        if(window.getComputedStyle(elems[c-1]).backgroundColor == "rgb(30, 30, 30)") {
            if(value == "BACK" || value == "ENT") {} else {return false;}
        }
    }

	if(value != "") {
		let corrette = []; // Correct positions array
		let presenti = []; // Semi-Correct positions array
		let errate = []; // Wrong positions array

        elems = document.querySelectorAll("[id='underline']");

        /* If ENTER or BACKSPACE not clicked write the letter in its space */

        if (value != "ENT" && value != "BACK") {
            elems[c].style.animationName = "popText";
            elems[c].setAttribute('data-before', value);
		    c++;
        }

        /* If BACKSPACE was clicked delete the last letter (Only if it wasn't checked yet) */

        if(value == "BACK") {
            if (window.getComputedStyle(elems[c-1]).backgroundColor == "rgb(30, 30, 30)") {
                elems[c-1].setAttribute('data-before', "");
                c--;
            }
        }

        /* If user wrote a word and enter was clicked */

		if(c % 5 == 0 && ent==1) {
            ent = 0;
			l = 0;
			for(var i = 5 * ra; i < 5 * r; i++) {

                /* Check and apply styles for correct letters */

				if(elems[i].getAttribute('data-before') == lettere[l]) {
					corrette.push(elems[i].getAttribute('data-before'));
                    elems[i].style.backgroundColor = "";
                    elems[i].className = "right";
				} else {

                    /* Check and apply styles for semi-correct letters */

					if(parola.indexOf(elems[i].getAttribute('data-before')) > -1) {
						presenti.push(elems[i].getAttribute('data-before'));
                        elems[i].style.backgroundColor = "";
                        elems[i].className = "present";
					} else {

                        /* Check and apply styles for wrong letters */

						errate.push(elems[i].getAttribute('data-before'));
                        elems[i].style.backgroundColor = "";
                        elems[i].className = "error";
					}
				}
				l++;
			}

            /* Apply styles to the on-screen keyboard */

			errate.forEach(function(errata) {
				var el = document.querySelector("button[value=" + errata + "]");
				el.className = "error";
			});
			presenti.forEach(function(presente) {
				var el = document.querySelector("button[value=" + presente + "]");
				el.className = "present";
			});
			corrette.forEach(function(corretta) {
				var el = document.querySelector("button[value=" + corretta + "]");
				el.className = "right";
			});

            /* If correct array length is 5 call the f:ann() with WIN, used rows and word */

			if(corrette.length == 5) ann(1, r, parola);
			else {

                /* If used rows are 5 call the f:ann() with LOOSE, no used rows and word */

				if(r == 5) ann(0, null, parola);
			}

            /* Some changes in vars and empty some arrays */

			r++;
			ra++;
			errate.length = 0;
			presenti.length = 0;
			corrette.length = 0;
		}
	}
});

/* PHYSICAL KEYBOARD */

window.addEventListener("keydown", function(e) {
	var key = `${e.key}`.toUpperCase();
	event.preventDefault();
	var value = key;

    if(c%5 == 0 && value=="ENTER")
        ent = 1;

    if(c%5==0 && c>1) {
        if(window.getComputedStyle(elems[c-1]).backgroundColor == "rgb(30, 30, 30)") {
            if(value == "BACKSPACE" || value == "ENTER") {} else {return false;}
        }
    }

	var element = document.querySelectorAll("button[value=" + key + "]");
    let corrette = [];
	let presenti = [];
	let errate = [];
	elems = document.querySelectorAll("[id='underline']");

    if (value!="ENTER" && value!="BACKSPACE") {
	elems[c].setAttribute('data-before', value);
	c++;
    }

    if(value == "BACKSPACE") {
        if (window.getComputedStyle(elems[c-1]).backgroundColor == "rgb(30, 30, 30)") {
            elems[c-1].setAttribute('data-before', "");
            c--;
            }
        }

	if(c % 5 == 0 && ent==1) {
        ent = 0;
		l = 0;
		for(var i = 5 * ra; i < 5 * r; i++) {

			if(elems[i].getAttribute('data-before') == lettere[l]) {
				corrette.push(elems[i].getAttribute('data-before'));
                elems[i].style.backgroundColor = "";
                elems[i].className = "right";
			} else {

				if(parola.indexOf(elems[i].getAttribute('data-before')) > -1) { // PRESENTI
					presenti.push(elems[i].getAttribute('data-before'));
                    elems[i].style.backgroundColor = "";
                    elems[i].className = "present";
				} else {

					errate.push(elems[i].getAttribute('data-before')); // ERRATE
                    elems[i].style.backgroundColor = "";
                    elems[i].className = "error";
				}
			}
			l++;
		}


		errate.forEach(function(errata) {
			var el = document.querySelector("button[value=" + errata + "]");
			el.className = "error";
		});
		presenti.forEach(function(presente) {
			var el = document.querySelector("button[value=" + presente + "]");
			el.className = "present";
		});
		corrette.forEach(function(corretta) {
			var el = document.querySelector("button[value=" + corretta + "]");
			el.className = "right";
		});


		if(corrette.length == 5) ann(1, r, parola);
		else {
			if(r == 5) ann(0, null, parola);
		}

		r++;
		ra++;
		errate.length = 0;
		presenti.length = 0;
		corrette.length = 0;
	}
});

/* Announcer trigger f */

function ann(res, rows, word) {
	var a = document.querySelector(".announcer");
	a.style.display = "initial";
	document.getElementById("word").innerHTML = "La parola era <span style='color:#2dbe0f'>" + word + "</span>";
	if(res == 1) {
		document.getElementById("result").innerHTML = "HAI <span style='color:green'>VINTO</span>!";
		document.getElementById("second").innerHTML = "Streak: " + parseInt(p + 1);
		
        /* Update cookie (if user win) */
        u_cookie();

		if(rows == 1) document.getElementById("first").innerHTML = "Hai indovinato in <span style='color:green'>" + rows + "</span> tentativo";
		else document.getElementById("first").innerHTML = "Hai indovinato in <span style='color:yellow'>" + rows + "</span> tentativi";
	} else {
		document.getElementById("result").innerHTML = "HAI <span style='color:red'>PERSO</span>!";
		document.getElementById("first").innerHTML = "Avevi <span style='color:red'>5</span> tentativi";
		document.getElementById("second").innerHTML = "Streak <span style='color:red'>terminata</span>!";
		
        /* Delete cookie (if user loose) */
        d_cookie();
	}

	// Start the announcer animation with some delay to see it
	setTimeout(function() {
		a.style.animation = "announcer 0.75s forwards";
	}, 100);
}

/* POINTS/STREAK MANAGEMENT f */

r_cookie();

/* Create points cookie */

function c_cookie() {
	document.cookie = "points=" + p + "; expires=Thu, 01-Jan-2030 00:00:01 GMT;";
}

/* Adjust the cookie */

function r_cookie() {
	let x = getCookie("points");
	if(x !== "") {
		p = parseInt(x);
	} else {
		let p = 0;
		c_cookie();
	}
}

/* Update cookie with +1 Point */

function u_cookie() {
	p = p + 1;
	c_cookie();
}

/* Delete cookie to restore when streak end */

function d_cookie() {
	p = 0;
	c_cookie();
}

/* Function to get cookie and use it */

function getCookie(cname) {
	let name = cname + "=";
	let decodedCookie = decodeURIComponent(document.cookie);
	let ca = decodedCookie.split(';');
	for(let i = 0; i < ca.length; i++) {
		let c = ca[i];
		while(c.charAt(0) == ' ') {
			c = c.substring(1);
		}
		if(c.indexOf(name) == 0) {
			return c.substring(name.length, c.length);
		}
	}
	return "";
}