// HELP GAME — conteúdo dos tutoriais de mecânicas básicas
// Cada entrada representa uma mecânica: código GML dividido por evento
// e a secção "Como Funciona" com a explicação linha a linha.
const TUTORIALS = {
  movimentacao: {
    tag: 'Mecânica 01',
    title: 'Movimentação Básica',
    file: 'obj_player — Create / Step',
    intro: 'Controlo horizontal simples usando uma variável própria em vez da variável nativa <code>speed</code>, para manter o movimento previsível e fácil de combinar com outras mecânicas.',
    code:
`<span class="ev">create:</span>
  hsp = 0
  <span class="cm">// spd substitui a variável nativa "speed"</span>
  spd = <span class="nu">2</span>
<span class="ev">step:</span>
  hsp = -<span class="fn">keyboard_check</span>(vk_left) + <span class="fn">keyboard_check</span>(vk_right)
  x += hsp * spd`,
    explain: [
      ['hsp', 'Guarda a direção horizontal do movimento a cada passo: -1 (esquerda), 0 (parado) ou 1 (direita).'],
      ['keyboard_check(vk_left/vk_right)', 'Devolve 1 enquanto a tecla está pressionada e 0 caso contrário. A subtração das duas chamadas produz sempre um vetor limpo de -1, 0 ou 1.'],
      ['spd', 'Variável personalizada que define a velocidade em pixels por passo. Evita usar a variável nativa speed, que também é afetada por outras funções de movimento do GameMaker.'],
      ['x += hsp * spd', 'Atualiza a posição horizontal multiplicando a direção pela velocidade, mantendo o controlo totalmente manual e previsível.'],
    ],
  },
  pulo: {
    tag: 'Mecânica 02',
    title: 'Pulo',
    file: 'obj_player — Create / Step',
    intro: 'Salto com gravidade progressiva: a personagem acelera para baixo continuamente e só pode saltar quando está a tocar no chão.',
    code:
`<span class="ev">create:</span>
  vsp = <span class="nu">0</span>
  grav = <span class="nu">0.4</span>
  jump_force = -<span class="nu">9</span>
<span class="ev">step:</span>
  <span class="kw">if</span> (<span class="fn">place_free</span>(x, y+<span class="nu">1</span>))
    vsp += grav
  <span class="kw">else</span>
    vsp = <span class="nu">0</span>
  <span class="kw">if</span> (<span class="fn">keyboard_check_pressed</span>(vk_space) &amp;&amp; !<span class="fn">place_free</span>(x, y+<span class="nu">1</span>))
    vsp = jump_force
  y += vsp`,
    explain: [
      ['vsp', 'Velocidade vertical acumulada; é a variável que efetivamente move a personagem no eixo Y a cada passo.'],
      ['grav', 'Valor somado a vsp a cada passo, simulando a aceleração da gravidade enquanto a personagem está no ar.'],
      ['place_free(x, y+1)', 'Verifica se o pixel imediatamente abaixo está livre — é o que diferencia "no ar" de "no chão" sem precisar de uma variável extra.'],
      ['jump_force', 'Valor negativo aplicado a vsp no instante do salto; negativo porque no GameMaker o eixo Y cresce para baixo.'],
      ['keyboard_check_pressed', 'Diferente de keyboard_check, só devolve 1 no frame exato em que a tecla foi pressionada, evitando saltos repetidos enquanto a tecla fica premida.'],
    ],
  },
  pause: {
    tag: 'Mecânica 03',
    title: 'Pause',
    file: 'obj_game_controller — Create / Step',
    intro: 'Sistema de pausa que congela todas as instâncias do jogo e ativa um menu, sem depender de room_speed ou de desligar o motor manualmente.',
    code:
`<span class="ev">create:</span>
  paused = <span class="kw">false</span>
<span class="ev">step:</span>
  <span class="kw">if</span> (<span class="fn">keyboard_check_pressed</span>(vk_escape))
    paused = !paused
  <span class="kw">if</span> (paused) {
    <span class="fn">instance_deactivate_all</span>(<span class="kw">true</span>)
    <span class="fn">instance_activate_object</span>(obj_pause_menu)
  } <span class="kw">else</span> {
    <span class="fn">instance_activate_all</span>()
  }`,
    explain: [
      ['paused', 'Flag booleana única que representa o estado do jogo; alternada a cada pressão de Esc.'],
      ['instance_deactivate_all(true)', 'Desativa o Step de todas as instâncias (o "true" preserva o próprio controlador ativo), congelando o jogo num único comando.'],
      ['instance_activate_object(obj_pause_menu)', 'Reativa apenas o menu de pausa, que fica invisível/inativo durante o jogo normal.'],
      ['instance_activate_all()', 'Reverte o congelamento assim que a pausa é desligada, devolvendo o controlo a todos os objetos.'],
    ],
  },
  dash: {
    tag: 'Mecânica 04',
    title: 'Dash',
    file: 'obj_player — Create / Step',
    intro: 'Impulso rápido e temporário na direção do movimento atual, controlado por um contador de frames em vez de um alarm dedicado.',
    code:
`<span class="ev">create:</span>
  dash_spd = <span class="nu">12</span>
  dash_time = <span class="nu">8</span>
  dash_timer = <span class="nu">0</span>
  dash_dir = <span class="nu">1</span>
<span class="ev">step:</span>
  <span class="kw">if</span> (<span class="fn">keyboard_check_pressed</span>(vk_shift) &amp;&amp; dash_timer &lt;= <span class="nu">0</span>) {
    dash_timer = dash_time
    dash_dir = (hsp != <span class="nu">0</span>) ? <span class="fn">sign</span>(hsp) : dash_dir
  }
  <span class="kw">if</span> (dash_timer &gt; <span class="nu">0</span>) {
    x += dash_dir * dash_spd
    dash_timer -= <span class="nu">1</span>
  }`,
    explain: [
      ['dash_timer', 'Conta quantos passos ainda faltam para o dash terminar; enquanto for maior que 0, o deslocamento extra é aplicado.'],
      ['dash_dir', 'Guarda a última direção horizontal usada, para o dash continuar mesmo que o jogador solte as teclas de movimento a meio do impulso.'],
      ['sign(hsp)', 'Devolve -1, 0 ou 1 conforme o sinal de hsp, reaproveitando a variável já usada na Movimentação Básico.'],
      ['dash_timer <= 0 na condição de ativação', 'Impede que um novo dash comece antes do atual terminar, sem precisar de uma variável booleana separada.'],
    ],
  },
  dano: {
    tag: 'Mecânica 05',
    title: 'Dano',
    file: 'obj_player — Create / Step',
    intro: 'Deteção de colisão com inimigos, redução de vida e um período curto de invencibilidade para evitar dano repetido no mesmo contacto.',
    code:
`<span class="ev">create:</span>
  hp = <span class="nu">100</span>
  inv_timer = <span class="nu">0</span>
<span class="ev">step:</span>
  <span class="kw">if</span> (inv_timer &gt; <span class="nu">0</span>)
    inv_timer -= <span class="nu">1</span>
  <span class="kw">if</span> (<span class="fn">place_meeting</span>(x, y, obj_inimigo) &amp;&amp; inv_timer &lt;= <span class="nu">0</span>) {
    hp -= <span class="nu">10</span>
    inv_timer = <span class="nu">60</span>
  }
  <span class="kw">if</span> (hp &lt;= <span class="nu">0</span>)
    <span class="fn">instance_destroy</span>()`,
    explain: [
      ['place_meeting(x, y, obj_inimigo)', 'Testa colisão usando a máscara de colisão do objeto na posição atual — mais indicado do que instance_place quando só se quer saber "houve contacto?", sem precisar da instância específica.'],
      ['inv_timer', 'Período de invencibilidade em passos; impede que hp desça em cada um dos frames em que o jogador continua encostado ao inimigo.'],
      ['hp -= 10', 'Reduz a vida em um valor fixo por contacto; pode ser substituído por uma variável de dano do inimigo para diferentes tipos de ameaça.'],
      ['instance_destroy()', 'Remove a instância do jogador quando a vida chega a zero — o ponto de entrada natural para acionar uma tela de Game Over.'],
    ],
  },
};
const TUTORIAL_ORDER = ['movimentacao', 'pulo', 'pause', 'dash', 'dano'];

