document.addEventListener('DOMContentLoaded', function(){
    //Variáveis globais no evento
    var player = ['<img src="images/X.png">', '<img src="images/O.png">'];
    var color = ['#4169e1', '#dc143c'];
    var gameOver = 0;
    var i = 0;
    //Gera tabela
    const body = document.querySelector('body');
    const table = document.createElement('table');
    const tvFutebol = document.createElement('p');
    const br = document.createElement('br');
    var tr = document.createElement('tr');
    var td = document.createElement('td');

    for(var lin=0;lin<3;lin++){
        tr = document.createElement('tr');
        for(var col=0;col<3;col++){
            td = document.createElement('td');
            td.setAttribute("id", `${(lin)*3 + (col+1)}`);
            td.setAttribute("class", "position");
            td.onclick = function (){
                jogar(this.id);
            }

            tr.appendChild(td);
        }
        table.appendChild(tr);
    }
    table.append(br);
    body.appendChild(table);
    tvFutebol.setAttribute("id", "tvFutebol");
    tvFutebol.innerHTML = '<br>Vez do Jogador: '
    tvFutebol.innerHTML += '<img src="images/X.png">'
    body.appendChild(tvFutebol);
    //Jogar
    function jogar(id){
        var isFull = 1;
        if (gameOver) document.location.reload(true);
        else{ //Pelo delay de reload
            var col, lin = 1;
            const pos = document.getElementById(String(id));
            if(pos.innerHTML === ''){
                pos.style.backgroundColor = color[i];
                pos.innerHTML = player[i];
                i++;
                if(i>1) i = 0;
                tvFutebol.innerHTML = '<br>Vez do Jogador: '
                tvFutebol.innerHTML += player[i];
            }
            col = parseInt(id);
            while(col>3){
                col = col - 3;
                lin++;
            }
            if (document.getElementById(String((lin-1)*3 + 1)).innerHTML === document.getElementById(String((lin-1)*3 + 2)).innerHTML
            && document.getElementById(String((lin-1)*3 + 1)).innerHTML === document.getElementById(String((lin-1)*3 + 3)).innerHTML){
                EndGame();
            }
            if (document.getElementById(String((0)*3 + col)).innerHTML === document.getElementById(String((1)*3 + col)).innerHTML
            && document.getElementById(String((0)*3 + col)).innerHTML === document.getElementById(String((2)*3 + col)).innerHTML){
                EndGame();
            }
            if (document.getElementById(String(1)).innerHTML === document.getElementById(String(5)).innerHTML &&
            document.getElementById(String(1)).innerHTML === document.getElementById(String(9)).innerHTML &&
            document.getElementById(String(1)).innerHTML !== ''){
                EndGame();
            }
            if (document.getElementById(String(3)).innerHTML === document.getElementById(String(5)).innerHTML &&
            document.getElementById(String(3)).innerHTML === document.getElementById(String(7)).innerHTML &&
            document.getElementById(String(3)).innerHTML !== ''){
                EndGame();
            }
            for (var j = 0; j<9; j++){
                if(document.getElementById(String(j+1)).innerHTML === '') isFull = 0;
            }
            if (gameOver === 0 && isFull === 1){
                tvFutebol.innerHTML = '<br>Fim de Jogo!<br>É um empate.';
                tvFutebol.style.backgroundColor = '#4b0082';
                tvFutebol.style.border = 'none';
                tvFutebol.style.borderRadius = '20px';
                gameOver = 1;
            }
        }
    }
    //Fim de Jogo
    function EndGame(){
        if(i == 1) i = 0;
        else {i = 1;}
        tvFutebol.innerHTML = `<br>Vitória do jogador ${player[i]}`
        gameOver = 1;
        tvFutebol.style.backgroundColor = color[i];
        tvFutebol.style.border = 'none';
        tvFutebol.style.borderRadius = '20px';
    }
});