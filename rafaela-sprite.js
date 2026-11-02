// Sprite pixel art da Rafaela — frente e costas, elaborado em grade 30x48.
const RAFAELA_PALETTE = {
 outline:"#2d2530",hair:"#443035",hair2:"#62433e",shine:"#916a58",
 skin:"#dba98f",shadow:"#b77e6b",eyes:"#2a2630",white:"#f9f4ed",
 grey:"#c9c8cd",vest:"#292e3a",vest2:"#444553",pants:"#383441",
 pants2:"#57505e",shoes:"#f2e3e2",pink:"#b96b82"
};
const RAFAELA_FRONT = [
[8,2,13,2,"outline"],[5,4,19,3,"outline"],[4,7,21,12,"hair"],
[3,11,5,15,"hair"],[21,12,5,14,"hair"],[4,23,5,7,"hair"],[20,22,6,9,"hair"],
[7,5,11,2,"hair2"],[5,9,4,9,"hair2"],[6,20,2,7,"hair2"],
[21,9,2,11,"hair2"],[22,22,2,6,"hair2"],[10,3,6,2,"shine"],
[5,11,2,4,"shine"],[23,17,2,4,"shine"],[8,10,13,12,"skin"],
[9,9,11,2,"skin"],[9,20,11,3,"skin"],[7,13,2,7,"shadow"],
[20,14,2,6,"shadow"],[7,8,6,4,"hair"],[12,7,6,3,"hair2"],
[18,8,4,5,"hair"],[10,7,6,1,"shine"],[9,14,5,1,"eyes"],
[16,14,5,1,"eyes"],[14,15,2,1,"eyes"],[9,15,1,4,"eyes"],
[13,15,1,4,"eyes"],[16,15,1,4,"eyes"],[20,15,1,4,"eyes"],
[10,18,3,1,"eyes"],[17,18,3,1,"eyes"],[10,16,1,1,"white"],
[17,16,1,1,"white"],[11,17,1,1,"eyes"],[18,17,1,1,"eyes"],
[13,21,4,1,"pink"],[12,22,5,3,"skin"],[8,25,14,11,"white"],
[6,26,3,8,"white"],[22,26,3,8,"white"],[6,34,3,3,"skin"],
[22,34,3,3,"skin"],[9,25,5,10,"vest"],[17,25,5,10,"vest"],
[13,26,5,7,"white"],[11,27,1,7,"vest2"],[18,28,1,7,"vest2"],
[13,34,5,2,"vest"],[10,36,12,2,"pants2"],[10,38,5,7,"pants"],
[17,38,5,7,"pants"],[11,39,1,5,"pants2"],[18,39,1,5,"pants2"],
[9,45,7,3,"shoes"],[17,45,7,3,"shoes"],[9,47,7,1,"outline"],
[17,47,7,1,"outline"]
];
const RAFAELA_BACK = [
[8,2,13,2,"outline"],[5,4,19,3,"outline"],[4,7,21,12,"hair"],
[3,11,5,16,"hair"],[21,12,5,15,"hair"],[4,23,5,7,"hair"],
[20,22,6,9,"hair"],[7,5,11,2,"hair2"],[5,9,4,9,"hair2"],
[6,20,2,7,"hair2"],[21,9,2,11,"hair2"],[22,22,2,6,"hair2"],
[10,3,6,2,"shine"],[5,11,2,4,"shine"],[23,17,2,4,"shine"],
[10,10,10,13,"hair2"],[12,12,6,10,"hair"],[13,15,2,5,"shine"],
[12,22,5,3,"skin"],[8,25,14,11,"vest"],[6,26,3,8,"white"],
[22,26,3,8,"white"],[6,34,3,3,"skin"],[22,34,3,3,"skin"],
[10,27,1,8,"vest2"],[19,27,1,8,"vest2"],[10,36,12,2,"pants2"],
[10,38,5,7,"pants"],[17,38,5,7,"pants"],[9,45,7,3,"shoes"],
[17,45,7,3,"shoes"],[9,47,7,1,"outline"],[17,47,7,1,"outline"]
];
window.drawRafaelaSprite = function(ctx, x, y, back, walking, t) {
 const bob = walking ? Math.round(Math.sin(t/150)) : 0;
 const ox = Math.round(x - 30), oy = Math.round(y - 96 + bob);
 const blocks = back ? RAFAELA_BACK : RAFAELA_FRONT;
 for (const [sx,sy,w,h,c] of blocks) {
   ctx.fillStyle = RAFAELA_PALETTE[c];
   ctx.fillRect(ox + sx*2, oy + sy*2, w*2, h*2);
 }
};
