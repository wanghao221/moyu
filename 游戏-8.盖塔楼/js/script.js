"use strict";
		console.clear();
		class Stage {
		    constructor() {
		        // container
		        this.render = function () {
		            this.renderer.render(this.scene, this.camera);
		        };
		        this.add = function (elem) {
		            this.scene.add(elem);
		        };
		        this.remove = function (elem) {
		            this.scene.remove(elem);
		        };
		        this.container = document.getElementById('game');
		        // renderer
		        this.renderer = new THREE.WebGLRenderer({
		            antialias: true,
		            alpha: false
		        });
		        this.renderer.setSize(window.innerWidth, window.innerHeight);
		        this.renderer.setClearColor('#D0CBC7', 1);
		        this.container.appendChild(this.renderer.domElement);
		        // scene
		        this.scene = new THREE.Scene();
		        // camera
		        let aspect = window.innerWidth / window.innerHeight;
		        let d = 20;
		        this.camera = new THREE.OrthographicCamera(-d * aspect, d * aspect, d, -d, -100, 1000);
		        this.camera.position.x = 2;
		        this.camera.position.y = 2;
		        this.camera.position.z = 2;
		        this.camera.lookAt(new THREE.Vector3(0, 0, 0));
		        //light
		        this.light = new THREE.DirectionalLight(0xffffff, 0.5);
		        this.light.position.set(0, 499, 0);
		        this.scene.add(this.light);
		        this.softLight = new THREE.AmbientLight(0xffffff, 0.4);
		        this.scene.add(this.softLight);
		        window.addEventListener('resize', () => this.onResize());
		        this.onResize();
		    }
		    setCamera(y, speed = 0.3) {
		        TweenLite.to(this.camera.position, speed, { y: y + 4, ease: Power1.easeInOut });
		        TweenLite.to(this.camera.lookAt, speed, { y: y, ease: Power1.easeInOut });
		    }
		    onResize() {
		        let viewSize = 30;
		        this.renderer.setSize(window.innerWidth, window.innerHeight);
		        this.camera.left = window.innerWidth / -viewSize;
		        this.camera.right = window.innerWidth / viewSize;
		        this.camera.top = window.innerHeight / viewSize;
		        this.camera.bottom = window.innerHeight / -viewSize;
		        this.camera.updateProjectionMatrix();
		    }
		}
		class Block {
		    constructor(block) {
		        // set size and position
		        this.STATES = { ACTIVE: 'active', STOPPED: 'stopped', MISSED: 'missed' };
		        this.MOVE_AMOUNT = 12;
		        this.dimension = { width: 0, height: 0, depth: 0 };
		        this.position = { x: 0, y: 0, z: 0 };
		        this.targetBlock = block;
		        this.index = (this.targetBlock ? this.targetBlock.index : 0) + 1;
		        this.workingPlane = this.index % 2 ? 'x' : 'z';
		        this.workingDimension = this.index % 2 ? 'width' : 'depth';
		        // set the dimensions from the target block, or defaults.
		        this.dimension.width = this.targetBlock ? this.targetBlock.dimension.width : 10;
		        this.dimension.height = this.targetBlock ? this.targetBlock.dimension.height : 2;
		        this.dimension.depth = this.targetBlock ? this.targetBlock.dimension.depth : 10;
		        this.position.x = this.targetBlock ? this.targetBlock.position.x : 0;
		        this.position.y = this.dimension.height * this.index;
		        this.position.z = this.targetBlock ? this.targetBlock.position.z : 0;
		        this.colorOffset = this.targetBlock ? this.targetBlock.colorOffset : Math.round(Math.random() * 100);
		        // set color
		        if (!this.targetBlock) {
		            this.color = 0x333344;
		        }
		        else {
		            let offset = this.index + this.colorOffset;
		            var r = Math.sin(0.3 * offset) * 55 + 200;
		            var g = Math.sin(0.3 * offset + 2) * 55 + 200;
		            var b = Math.sin(0.3 * offset + 4) * 55 + 200;
		            this.color = new THREE.Color(r / 255, g / 255, b / 255);
		        }
		        // state
		        this.state = this.index > 1 ? this.STATES.ACTIVE : this.STATES.STOPPED;
		        // set direction
		        this.speed = -0.1 - (this.index * 0.005);
		        if (this.speed < -4)
		            this.speed = -4;
		        this.direction = this.speed;
		        // create block
		        let geometry = new THREE.BoxGeometry(this.dimension.width, this.dimension.height, this.dimension.depth);
		        geometry.applyMatrix(new THREE.Matrix4().makeTranslation(this.dimension.width / 2, this.dimension.height / 2, this.dimension.depth / 2));
		        this.material = new THREE.MeshToonMaterial({ color: this.color, shading: THREE.FlatShading });
		        this.mesh = new THREE.Mesh(geometry, this.material);
		        this.mesh.position.set(this.position.x, this.position.y + (this.state == this.STATES.ACTIVE ? 0 : 0), this.position.z);
		        if (this.state == this.STATES.ACTIVE) {
		            this.position[this.workingPlane] = Math.random() > 0.5 ? -this.MOVE_AMOUNT : this.MOVE_AMOUNT;
		        }
		    }
		    reverseDirection() {
		        this.direction = this.direction > 0 ? this.speed : Math.abs(this.speed);
		    }
		    place() {
		        this.state = this.STATES.STOPPED;
		        let overlap = this.targetBlock.dimension[this.workingDimension] - Math.abs(this.position[this.workingPlane] - this.targetBlock.position[this.workingPlane]);
		        let blocksToReturn = {
		            plane: this.workingPlane,
		            direction: this.direction
		        };
		        if (this.dimension[this.workingDimension] - overlap < 0.3) {
		            overlap = this.dimension[this.workingDimension];
		            blocksToReturn.bonus = true;
		            this.position.x = this.targetBlock.position.x;
		            this.position.z = this.targetBlock.position.z;
		            this.dimension.width = this.targetBlock.dimension.width;
		            this.dimension.depth = this.targetBlock.dimension.depth;
		        }
		        if (overlap > 0) {
		            let choppedDimensions = { width: this.dimension.width, height: this.dimension.height, depth: this.dimension.depth };
		            choppedDimensions[this.workingDimension] -= overlap;
		            this.dimension[this.workingDimension] = overlap;
		            let placedGeometry = new THREE.BoxGeometry(this.dimension.width, this.dimension.height, this.dimension.depth);
		            placedGeometry.applyMatrix(new THREE.Matrix4().makeTranslation(this.dimension.width / 2, this.dimension.height / 2, this.dimension.depth / 2));
		            let placedMesh = new THREE.Mesh(placedGeometry, this.material);
		            let choppedGeometry = new THREE.BoxGeometry(choppedDimensions.width, choppedDimensions.height, choppedDimensions.depth);
		            choppedGeometry.applyMatrix(new THREE.Matrix4().makeTranslation(choppedDimensions.width / 2, choppedDimensions.height / 2, choppedDimensions.depth / 2));
		            let choppedMesh = new THREE.Mesh(choppedGeometry, this.material);
		            let choppedPosition = {
		                x: this.position.x,
		                y: this.position.y,
		                z: this.position.z
		            };
		            if (this.position[this.workingPlane] < this.targetBlock.position[this.workingPlane]) {
		                this.position[this.workingPlane] = this.targetBlock.position[this.workingPlane];
		            }
		            else {
		                choppedPosition[this.workingPlane] += overlap;
		            }
		            placedMesh.position.set(this.position.x, this.position.y, this.position.z);
		            choppedMesh.position.set(choppedPosition.x, choppedPosition.y, choppedPosition.z);
		            blocksToReturn.placed = placedMesh;
		            if (!blocksToReturn.bonus)
		                blocksToReturn.chopped = choppedMesh;
		        }
		        else {
		            this.state = this.STATES.MISSED;
		        }
		        this.dimension[this.workingDimension] = overlap;
		        return blocksToReturn;
		    }
		    tick() {
		        if (this.state == this.STATES.ACTIVE) {
		            let value = this.position[this.workingPlane];
		            if (value > this.MOVE_AMOUNT || value < -this.MOVE_AMOUNT)
		                this.reverseDirection();
		            this.position[this.workingPlane] += this.direction;
		            this.mesh.position[this.workingPlane] = this.position[this.workingPlane];
		        }
		    }
		}
		class Game {
		    constructor() {
		        this.STATES = {
		            'LOADING': 'loading',
		            'PLAYING': 'playing',
		            'READY': 'ready',
		            'ENDED': 'ended',
		            'RESETTING': 'resetting'
		        };
		        this.blocks = [];
		        this.state = this.STATES.LOADING;
		        this.stage = new Stage();
		        this.mainContainer = document.getElementById('container');
		        this.scoreContainer = document.getElementById('score');
		        this.startButton = document.getElementById('start-button');
		        this.instructions = document.getElementById('instructions');
		        this.scoreContainer.innerHTML = '0';
		        this.newBlocks = new THREE.Group();
		        this.placedBlocks = new THREE.Group();
		        this.choppedBlocks = new THREE.Group();
		        this.stage.add(this.newBlocks);
		        this.stage.add(this.placedBlocks);
		        this.stage.add(this.choppedBlocks);
		        this.addBlock();
		        this.tick();
		        this.updateState(this.STATES.READY);
		        document.addEventListener('keydown', e => {
		            if (e.keyCode == 32)
		                this.onAction();
		        });
		        document.addEventListener('click', e => {
		            this.onAction();
		        });
		        document.addEventListener('touchstart', e => {
		            e.preventDefault();
		            // this.onAction();
		            // ☝️ this triggers after click on android so you
		            // insta-lose, will figure it out later.
		        });
		    }
		    updateState(newState) {
		        for (let key in this.STATES)
		            this.mainContainer.classList.remove(this.STATES[key]);
		        this.mainContainer.classList.add(newState);
		        this.state = newState;
		    }
		    onAction() {
		        switch (this.state) {
		            case this.STATES.READY:
		                this.startGame();
		                break;
		            case this.STATES.PLAYING:
		                this.placeBlock();
		                break;
		            case this.STATES.ENDED:
		                this.restartGame();
		                break;
		        }
		    }
		    startGame() {
		        if (this.state != this.STATES.PLAYING) {
		            this.scoreContainer.innerHTML = '0';
		            this.updateState(this.STATES.PLAYING);
		            this.addBlock();
		        }
		    }
		    restartGame() {
		        this.updateState(this.STATES.RESETTING);
		        let oldBlocks = this.placedBlocks.children;
		        let removeSpeed = 0.2;
		        let delayAmount = 0.02;
		        for (let i = 0; i < oldBlocks.length; i++) {
		            TweenLite.to(oldBlocks[i].scale, removeSpeed, { x: 0, y: 0, z: 0, delay: (oldBlocks.length - i) * delayAmount, ease: Power1.easeIn, onComplete: () => this.placedBlocks.remove(oldBlocks[i]) });
		            TweenLite.to(oldBlocks[i].rotation, removeSpeed, { y: 0.5, delay: (oldBlocks.length - i) * delayAmount, ease: Power1.easeIn });
		        }
		        let cameraMoveSpeed = removeSpeed * 2 + (oldBlocks.length * delayAmount);
		        this.stage.setCamera(2, cameraMoveSpeed);
		        let countdown = { value: this.blocks.length - 1 };
		        TweenLite.to(countdown, cameraMoveSpeed, { value: 0, onUpdate: () => { this.scoreContainer.innerHTML = String(Math.round(countdown.value)); } });
		        this.blocks = this.blocks.slice(0, 1);
		        setTimeout(() => {
		            this.startGame();
		        }, cameraMoveSpeed * 1000);
		    }
		    placeBlock() {
		        let currentBlock = this.blocks[this.blocks.length - 1];
		        let newBlocks = currentBlock.place();
		        this.newBlocks.remove(currentBlock.mesh);
		        if (newBlocks.placed)
		            this.placedBlocks.add(newBlocks.placed);
		        if (newBlocks.chopped) {
		            this.choppedBlocks.add(newBlocks.chopped);
		            let positionParams = { y: '-=30', ease: Power1.easeIn, onComplete: () => this.choppedBlocks.remove(newBlocks.chopped) };
		            let rotateRandomness = 10;
		            let rotationParams = {
		                delay: 0.05,
		                x: newBlocks.plane == 'z' ? ((Math.random() * rotateRandomness) - (rotateRandomness / 2)) : 0.1,
		                z: newBlocks.plane == 'x' ? ((Math.random() * rotateRandomness) - (rotateRandomness / 2)) : 0.1,
		                y: Math.random() * 0.1,
		            };
		            if (newBlocks.chopped.position[newBlocks.plane] > newBlocks.placed.position[newBlocks.plane]) {
		                positionParams[newBlocks.plane] = '+=' + (40 * Math.abs(newBlocks.direction));
		            }
		            else {
		                positionParams[newBlocks.plane] = '-=' + (40 * Math.abs(newBlocks.direction));
		            }
		            TweenLite.to(newBlocks.chopped.position, 1, positionParams);
		            TweenLite.to(newBlocks.chopped.rotation, 1, rotationParams);
		        }
		        this.addBlock();
		    }
		    addBlock() {
		        let lastBlock = this.blocks[this.blocks.length - 1];
		        if (lastBlock && lastBlock.state == lastBlock.STATES.MISSED) {
		            return this.endGame();
		        }
		        this.scoreContainer.innerHTML = String(this.blocks.length - 1);
		        let newKidOnTheBlock = new Block(lastBlock);
		        this.newBlocks.add(newKidOnTheBlock.mesh);
		        this.blocks.push(newKidOnTheBlock);
		        this.stage.setCamera(this.blocks.length * 2);
		        if (this.blocks.length >= 5)
		            this.instructions.classList.add('hide');
		    }
		    endGame() {
		        this.updateState(this.STATES.ENDED);
		    }
		    tick() {
		        this.blocks[this.blocks.length - 1].tick();
		        this.stage.render();
		        requestAnimationFrame(() => { this.tick(); });
		    }
		}
		let game = new Game();
		
		;(function(){
		  
			var icon = '<svg class="sg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 185.31 251.89"><path d="M66.8,144.17c0-66.24,22.46-113.09,80.72-112.32,81.48,1.07,80.72,46.08,80.72,112.32,0,5.15,8.38,3.81,7.62,19-2.28,19.42-9.44,14.63-10.39,19.85-9.26,51.08-40.65,88.67-77.95,88.67-37.76,0-69.47-38.53-78.28-90.58-.82-4.85-5.86-.8-6.42-18.68C61.47,146.07,66.8,149.07,66.8,144.17Z" transform="translate(-56.6 -25.84)" style="fill:#ffdfbf;fill-rule:evenodd"/><path d="M147.52,31.85C99.49,31.22,75.79,63,69,111.24c8.78-23.84,27.86-26,64.33-26.54,70.62-1.13,88.39,8.27,79.64,96.55-1.84,18.6-6.1,24.62-28.36,39.74-12.07,8.2,18.54-26.37-49.78-27-49.5-.43-30.06,36.41-40.06,29.44a81.88,81.88,0,0,1-20.28-20.73c12.89,40.76,40.76,69,73.08,69,37.3,0,68.69-37.59,77.95-88.67l2.77-38.89C228.24,77.93,229,32.91,147.52,31.85Z" transform="translate(-56.6 -25.84)" style="fill:#d0b57b;fill-rule:evenodd"/><path d="M146.13,31.84h1.39c81.48,1.07,80.72,46.08,80.72,112.33,0,5.15,8.38,3.81,7.62,19-2.28,19.42-9.44,14.63-10.39,19.85-9.26,51.08-40.65,88.67-77.95,88.67-37.76,0-69.47-38.53-78.28-90.58-.82-4.85-5.86-.8-6.42-18.68-1.34-16.39,4-13.39,4-18.29,0-65.71,22.11-112.33,79.33-112.33m0-6h0c-29.39,0-51.65,11.54-66.18,34.3C67.3,80,60.86,108.06,60.8,143.68h0c-2.54,3.05-4.94,7-4,19.12.4,12.11,2.72,16.46,6.59,19.86,9.65,56,44.19,95.07,84.11,95.07,19.91,0,38.59-9.42,54-27.25,14.35-16.57,24.87-39.79,29.66-65.45l0,0c4.22-2.57,8.87-6.53,10.58-21.1l0-.2v-.2c.58-11.55-3.35-16.18-7.07-19.61l-.53-.5v-1c0-33,0-61.46-10.76-82.11-12-23-36.09-33.89-75.88-34.41Z" transform="translate(-56.6 -25.84)" style="fill:#303030"/><path d="M118.31,183.29s4.28,4.28,12.84,4S143.67,182,143.67,182s-3.62,8.23-11.53,8.89S118.31,183.29,118.31,183.29Z" transform="translate(-56.6 -25.84)" style="fill:#bfa78f;fill-rule:evenodd"/><ellipse cx="44.24" cy="115.64" rx="28.15" ry="35.97" style="fill:#fff"/><ellipse cx="104.54" cy="115.64" rx="28.15" ry="35.97" style="fill:#fff"/><circle class="eye" id="eye-left" cx="35.9" cy="121.66" r="10.5" style="fill:#303030"/><circle class="eye" cx="94.57" cy="121.66" r="10.5" style="fill:#303030"/><path d="M140.74,236.63h0c-16.92,0-29.43-4.38-29.43-18.42h0c0-4.22,4.12-7.64,9.21-7.64H160c3.6,0,6.53,2.42,6.53,5.42v7.23C166.55,234.48,154.32,236.63,140.74,236.63Z" transform="translate(-56.6 -25.84)" style="fill:#2d251d;fill-rule:evenodd"/><path d="M160,210.57h-39.5c-5.09,0-9.21,3.42-9.21,7.64,0,.07,0,.15,0,.22,7.57,2.29,17.6,3.2,29,3.2h0c9.87,0,19.24-.52,26.25-2.36V216C166.55,213,163.62,210.57,160,210.57Z" transform="translate(-56.6 -25.84)" style="fill:#fff"/></svg>';
		
			document.head.insertAdjacentHTML('beforeend','<style>.sg { width: 35px; height: 35px; position: fixed; bottom: 10px; right: 10px; } .sg .eye { -webkit-transform: translateX(0px);   transform: translateX(0px); } .sg:hover .eye { -webkit-transition: -webkit-transform 0.3s ease; transition: -webkit-transform 0.3s ease; transition: transform 0.3s ease; transition: transform 0.3s ease, -webkit-transform 0.3s ease; -webkit-transform: translateX(12px);   transform: translateX(12px); }</style>'); 
		  
			var a = document.createElement('a');
			a.setAttribute('href','https://twitter.com/steeevg');
			a.setAttribute('target','_blank');
			a.innerHTML = icon;
		    
		 	document.body.appendChild(a);
		})();