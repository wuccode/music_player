const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
let analyser = audioCtx.createAnalyser(),
  source = null;
source = audioCtx.createMediaElementSource($("#music"));
analyser.connect(audioCtx.destination);
analyser.fftSize = 512;
let bufferLength = analyser.frequencyBinCount;
let dataArray = new Uint8Array(bufferLength);
let gainNode = audioCtx.createGain();
source.connect(analyser);
source.connect(gainNode);
gainNode.connect(audioCtx.destination);
let canvas = document.getElementById("canvas");
let { width, height } = canvas;
let ctx = canvas.getContext("2d");
let grd = ctx.createLinearGradient(0, height, 0, 0);
grd.addColorStop(0, "rgba(255, 255, 255, 0.1)");
grd.addColorStop(0.045, "rgba(255, 255, 255, 0.2)");
grd.addColorStop(0.1, "rgba(255, 255, 255, 0.9)");
grd.addColorStop(1, "rgba(255, 255, 255)");

const randomValues = Array.from({ length: 25 }, () =>
  Math.floor(Math.random() * 200)
);
// 创建粒子数组
const particles = [];
class Particle {
  constructor(index, value) {
    this.index = index;
    this.baseValue = value;
    this.value = value;
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = 2 + value / 25;
    this.speedX = (Math.random() - 0.1) * (value / 700);
    this.speedY = (Math.random() - 0.1) * (value / 700);
    this.color = `rgba(255, 255, 255, 0.07)`;
    this.angle = Math.random() * Math.PI * 2;
    this.angleSpeed = (Math.random() - 0.5) * 0.02;
    this.orbitRadius = 20 + value / 5;
    this.oscillation = Math.random() * Math.PI * 2;
    this.oscillationSpeed = 0.01 + Math.random() * 0.02;
  }
  update(size) {
    // 边界检查
    if (this.x < 0 || this.x > canvas.width) {
      this.speedX *= -1;
    }
    if (this.y < 0 || this.y > canvas.height) {
      this.speedY *= -1;
    }
    // 更新位置
    this.angle += this.angleSpeed;
    this.oscillation += this.oscillationSpeed;

    // 添加一些有机运动
    this.x += this.speedX + (Math.cos(this.angle) * 0.1) / 3;
    this.y += this.speedY + (Math.sin(this.angle) * 0.1) / 3;

    // 基于随机值的振荡效果
    this.value = this.baseValue + Math.sin(this.oscillation) * 20;
    this.size = size / 30;
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
    // 绘制光晕效果
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size * 1.5, 0, Math.PI * 2);
    ctx.fillStyle = `${this.color}20`;
    ctx.fill();
  }
}
randomValues.forEach((value, index) => {
  particles.push(new Particle(index, value));
});
function draw() {
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = grd;
  analyser.getByteFrequencyData(dataArray);
  dataArr = [...dataArray];
  dataArr.shift();
  dataArr.shift();
  dataArr.shift();
  dataArr.shift();
  dataArr.shift();
  dataArr.shift();
  const len = dataArr.length / 2;
  const barWidth = width / len / 2;
  for (let i = 0; i < len; i++) {
    const data = dataArr[i];
    const barHeight = (data / 850) * 100;
    const x1 = i * 2 + width / 2;
    const x2 = width / 2 - i * 2;
    const y = 160 - barHeight;
    ctx.fillRect(x1, y, barWidth - 2, barHeight);
    i && ctx.fillRect(x2, y, barWidth - 2, barHeight);
  }
  particles.forEach((particle, index) => {
    particle.update(dataArr[index]);
    particle.draw();
  });
  if (audioCtx.state == "running") requestAnimationFrame(draw);
}
audioCtx.onstatechange = () => {
  if (audioCtx.state == "running") draw();
};
