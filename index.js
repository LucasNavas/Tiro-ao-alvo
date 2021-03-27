(function(){
'use strict'

    // declaração de elementos html
    const $canvas = document.querySelector('[data-js="canvas"]')
    const $iniciar = document.querySelector('[data-js="iniciar"]')
    const $parar = document.querySelector('[data-js="parar"]')
    const $radio = document.getElementsByName("mode")
    const $numeroAlvos = document.getElementById("numeroAlvo")
    const $placar = document.getElementById('placar')
    const $acertos = document.getElementById('acertos')
    const $erros = document.getElementById('erros')
    // declaração de elementos globais (coisas que não seriam necessárias com o react talvez)
    var x   // gambiarra das feias, mas não ta errado
    var y
    var erros = 0
    var acertos = 0
    var numeroAlvos = 0
    var intervalo
    var total = 0
    

    // canvas
    const drawer = $canvas.getContext('2d')

    // dividi o código em blocos e comentei pra você entender o contexto

    
    // [BLOCO 1] verificadores de configurações do usuário

    const verifyMode = () => {
        var difficulty = ''
        for (var i = 0; i < $radio.length; i++) {
            if ($radio[i].checked) {
                difficulty = $radio[i].value
            }
        }
        return difficulty
    }
    const difficultyManager = () => {
        var rules
        switch (verifyMode()){
            case 'easy' : return rules = {tempo: 1000, raio: 10};
            case 'regular' : return rules = {tempo: 1000, raio: 8};
            case 'hard' : return rules = {tempo: 500, raio: 8};
            default: console.log('hola')
        }
    }

    
    // [BLOCO 2] o jogo funcionando em si, as funções estão em ordem seguindo um conceito parecido com um padrão middleware

    const startGame  = () => {
        resetCanvas()
        const dificuldade = verifyMode()
        numeroAlvos = $numeroAlvos.value
            if (!dificuldade){
                window.alert('Selecione um modo de jogo antes');
                return;
            }
            if (numeroAlvos <= 0){
                window.alert('Selecione um número de alvos antes');
                return;
            }
            $placar.style.opacity = 100
            $iniciar.disabled = true
        drawCanvas() // next()
        
        
    }

    const drawCanvas = () => {
        drawer.fillStyle="#000000"
        drawer.fillRect(0,0,500,500)
        var mensagem = `Jogando no modo ${verifyMode()}, o jogo já vai começar`
        drawer.font="15pt Arial"
        drawer.fillStyle="white"
        drawer.fillText(mensagem,10,50)
    setTimeout(startTime,2000) // next()

    }
    const startTime = () => {
        resetCanvas()
        limpaTela()
        $parar.disabled = false
        $canvas.addEventListener('click',shootManager)
        const specs = difficultyManager()

        intervalo = setInterval(() => {
            drawAlvo() // next()
            total++
            setTimeout(limpaTela,specs.tempo)
            if (total > numeroAlvos - 1) {
                clearInterval(intervalo)
            }
        }, specs.tempo + 500)


    }
    
    const sorteiaposicao = (minimo,maximo) => {
		return Math.floor(Math.random() * (maximo - minimo) + minimo)
	}
    
    const drawAlvo = function drawAlvo () {
        x = sorteiaposicao(20,480)
        y = sorteiaposicao(20,480)
        const specs = difficultyManager()
        drawer.fillStyle='red'
		drawer.beginPath();
		drawer.arc(x, y, specs.raio + 10, 0,2*Math.PI);
		drawer.fill();
    }

    // [BLOCO 3] funções necessárias pra manutenção do canvas

    const shootManager = (evento) => {
        const specs = difficultyManager()
        var xClick = evento.pageX-$canvas.offsetLeft;
        var yClick = evento.pageY-$canvas.offsetTop;
            if ((xClick > x-specs.raio-10) && (xClick < x + specs.raio+10) && (yClick > y-specs.raio-10) && (yClick < y + specs.raio+10)){
				shootAcerto()
            }

    }

    const limpaTela = () => {
        drawer.fillStyle="#000000"
        drawer.fillRect(0,0,500,500)
        $acertos.innerHTML = `Acertos: ${acertos}`
        $erros.innerHTML = `Erros: ${total - acertos}`
    }
    
    const limpaCirculo = () => {
        const specs = difficultyManager()
        drawer.fillStyle='#000000'
		drawer.beginPath();
		drawer.arc(x, y, specs.raio + 10, 0,2*Math.PI);
		drawer.fill();
    }

    const resetCanvas = () => {
        erros = 0
        acertos = 0
        total = 0
        $acertos.innerHTML = `Acertos: 0`
        $erros.innerHTML = `Erros: 0`
    }

    const shootAcerto = ()  => {
        acertos++ 
        limpaCirculo()
    }
    
    const stopGame = () => {  
        clearInterval(intervalo)
        $iniciar.disabled = false
        $parar.disabled = true
        $acertos.innerHTML = `Acertos: ${acertos}`
        $erros.innerHTML = `Erros: ${total - acertos}`
        
    }

    $parar.addEventListener('click',stopGame)
    $iniciar.addEventListener('click', startGame)


})()