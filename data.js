// "База даних" магазину: масив об'єктів JavaScript
const products = [
  { id: 1,  name: "Сухий корм для собак Grandorf, 3 кг", cat: "dogs",    price: 489, old: 560, img: "dog-food.jpg",  emoji: "🦴" },
  { id: 2,  name: "М'яч-іграшка для собак, гума",             cat: "dogs",    price: 129, old: 0,   img: "dog-ball.jpg",  emoji: "🎾" },
  { id: 3,  name: "Нашийник нейлоновий регульований",         cat: "dogs",    price: 199, old: 0,   img: "dog-collar.jpg",emoji: "🐕" },
  { id: 4,  name: "Вологий корм для котів, лосось, 85 г",     cat: "cats",    price: 38,  old: 0,   img: "cat-food.jpg",  emoji: "🐟" },
  { id: 5,  name: "Наповнювач для котячого туалету, 5 л",     cat: "cats",    price: 215, old: 249, img: "cat-litter.jpg",emoji: "🧺" },
  { id: 6,  name: "Дряпка-стовпчик для котів",                cat: "cats",    price: 649, old: 0,   img: "cat-post.jpg",  emoji: "🐈" },
  { id: 7,  name: "Корм для папуг, суміш зерен, 500 г",       cat: "birds",   price: 98,  old: 0,   img: "bird-food.jpg", emoji: "🦜" },
  { id: 8,  name: "Клітка для птахів, середня",               cat: "birds",   price: 1190,old: 1390,img: "bird-cage.jpg", emoji: "🪺" },
  { id: 9,  name: "Корм для хом'яків, 400 г",                 cat: "rodents", price: 89,  old: 0,   img: "hamster.jpg",   emoji: "🐹" },
  { id: 10, name: "Колесо для гризунів, 18 см",               cat: "rodents", price: 175, old: 0,   img: "wheel.jpg",     emoji: "🎡" },
  { id: 11, name: "Корм для акваріумних рибок, пластівці",    cat: "fish",    price: 79,  old: 0,   img: "fish-food.jpg", emoji: "🐠" },
  { id: 12, name: "Акваріум 20 л з кришкою",                  cat: "fish",    price: 1450,old: 1650,img: "aquarium.jpg",  emoji: "🫧" }
];
const categories = { dogs: "Собаки", cats: "Коти", birds: "Птахи", rodents: "Гризуни", fish: "Рибки" };
