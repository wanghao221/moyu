//无JS
import { quotes } from "http://haiyong.site/wp-includes/js/quotes.js";
let randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
console.log(
  `%c✨ ${randomQuote}`,
  "font-size:20px; background:#FFF; color:#581845;padding:10px; border: 3px solid #581845;border-radius:10px;"
);
