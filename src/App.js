import logo from './logo.svg';
import './App.css';
import React from 'react';

class App extends React.Component{

  constructor(props) {
    super(props);
    const squareNumber = 10
    const word = this.array[Math.floor(Math.random() * this.array.length)].toUpperCase();

    const maxPositions = squareNumber * squareNumber;
    var same = false;
    const arrayPositions = [];
    const closeBy = [];
    const lettersFound = [];
    const inputLetters = [];
    const inputTriesLeft = 2;

    for (var i = 0; i < 6;){
      var rnd = Math.floor(Math.random() * maxPositions);

      for(var j = 0; j < i; j++){
        if(arrayPositions[j] === rnd)
          same = true;
      }
      if (same){
        same = false;
        continue;
      }
      i++;
      arrayPositions.push(rnd);

      lettersFound.push(<td className='td-notSelected' key={"notFound" + i}>?</td>)
      for (var t = 0; t < inputTriesLeft; t++) {
        inputLetters.push(<td className='td-notSelected' key={"input" + (t*6 + i)}></td>)
      }
      closeBy.push({rowLetter: String.fromCharCode(65 + Math.floor(rnd / squareNumber)), row: rnd % squareNumber, line: Math.floor(rnd / squareNumber), found: false, key: rnd, value: word[j]});
    }
    
    console.log(JSON.stringify(closeBy, null, "  "));
    
    var tds = [];
    const allCells = [];
    for (i = 0; i < squareNumber; i++) {
        var lines = [];
        for(j = 0; j < squareNumber; j++) {
          const row = <td className='td-notSelected' key={i*squareNumber+j} data-key={i*squareNumber+j} onClick={this.cellPressed.bind(this)}></td>
          lines.push(row);
          allCells.push(row);
        }

        var value = "tr-" + (i*squareNumber+j);
        tds.push(<tr key={value} children={lines}/>);
    }
      
    this.state = { found: 0, arrayPositions: arrayPositions, word: word, squareNumber: squareNumber, cells: allCells, tds: tds, close: closeBy, lettersFound: lettersFound, inputLetters: inputLetters, matrixTriesLeft: squareNumber, inputTriesLeft: inputTriesLeft, inputTries: 0, inputArrayLetters: [] };
  }
    
  render() {

    var toShow;

    if (this.state.matrixTriesLeft !== 0){
      const tds= [];
      for(var i = 0; i < this.state.squareNumber; i++){
        var initialCell = <td className='td-selected' key={"hed" + i}>{String.fromCharCode(65 + i)}</td>;
        var lineCells= [initialCell];
        for(var j = 0; j < this.state.squareNumber; j++){
          lineCells.push(this.state.cells[i*this.state.squareNumber+j]);
        }
  
        var value = "tr-" + (i*this.state.squareNumber+j);
        tds.push(<tr key={value} children={lineCells}/>);
      }

      toShow = <div className='center'><p>Find the letters to form the word of the day, you have {this.state.matrixTriesLeft} tries left</p><table>{tds}</table>
      <p>The letters you've found</p><table>{this.state.lettersFound}</table></div>
    }
    else {    
      const tds = [];
      for(var i = 0; i < 2; i++){
        const lineCells = [];
        for(var j = 0; j < 6; j++){
          lineCells.push(this.state.inputLetters[i*6+j]);
        }

        var value = "tr-" + (i*this.state.squareNumber+j);
        tds.push(<tr key={value} children={lineCells}/>);
      }

      toShow = <div className='center'><p>The letters you've found</p><table>{this.state.lettersFound}</table><p>Now you just need to take a guess, you have 2 tries</p>
      <table>{tds}</table></div>
    }

    return (
      <div className="App">
        <header className="App-header">
          <h2>MineWordle</h2>
            {toShow}
        </header>
      </div>
    );
  }

  keyboardPressed(event){
    const inputLetters = this.state.inputLetters;
    var inputTriesLeft = this.state.inputTriesLeft;
    var inputTries = this.state.inputTries;
    const inputArrayLetters = this.state.inputArrayLetters;
    
    let isLetter = event.key.toLowerCase() !== event.key.toUpperCase() && event.key.length === 1;
    if (isLetter && (inputArrayLetters.length >= 6 * inputTries) && inputArrayLetters.length < 6 + 6 * (inputTries)){
      inputLetters[inputArrayLetters.length + 6 * (inputTries)] = <td className='td-notSelected' key={"input" + (inputArrayLetters.length-1)}>{event.key.toUpperCase()}</td>;
      inputArrayLetters.push(event.key.toUpperCase());
      this.setState({inputLetters, inputArrayLetters});
    }
    else if (!isLetter && (inputArrayLetters.length > 6 * inputTries) && event.keyCode === 8){
        inputArrayLetters.pop();
        inputLetters[inputArrayLetters.length] = <td className='td-notSelected' key={"input" + (inputArrayLetters.length-1)}></td>;
        this.setState({inputLetters, inputArrayLetters});
    }
    else if (event.keyCode === 13 && inputArrayLetters.length === 6 + 6 * (inputTries)){
      inputTries += 1;
      inputTriesLeft -=1;

      if (inputTriesLeft === 0){
        document.removeEventListener("keydown", this.keyboardPressed.bind(this), false);
      }

      this.setState({inputTries, inputTriesLeft});
    }


    console.log(event);
  }

  cellPressed(event) {
    var boxNumber = Number(event.target.attributes["data-key"].value);
    const allCells = this.state.cells;
    const closeBy = this.state.close;
    const numFound = this.state.found;
    const lettersFound = this.state.lettersFound;
    var matrixTriesLeft = this.state.matrixTriesLeft;
    
    if (numFound === 6 || this.state.matrixTriesLeft === 0){
      return;
    }
    matrixTriesLeft -= 1;
    
     for(var i = 0; i < this.state.squareNumber; i++){
      if(boxNumber === this.state.arrayPositions[i]){

        allCells[boxNumber] = <td className='td-found' key={boxNumber} data-key={boxNumber} ></td>
        closeBy[i].found = true;
        if (closeBy[i].value.toUpperCase() === this.state.word[numFound].toUpperCase()){
          lettersFound[numFound] = <td className='td-found' key={"found" + boxNumber} data-key={boxNumber} >{closeBy[i].value}</td>
        }
        else {
          lettersFound[numFound] = <td className='td-foundNotRight' key={"found" + boxNumber} data-key={boxNumber} >{closeBy[i].value}</td>
        }

        this.setState({ cells: allCells, close: closeBy, lettersFound: lettersFound, found: numFound + 1, matrixTriesLeft: matrixTriesLeft});

        if (numFound + 1 === 6 || matrixTriesLeft === 0) {
          document.addEventListener("keydown", this.keyboardPressed.bind(this), false);
        }
        return;
      }
    }

    var pressedRow = boxNumber % this.state.squareNumber;
    var pressedLine = Math.floor(boxNumber / this.state.squareNumber);
    var closest = {leftRight: false, lineDist: this.state.squareNumber+1, row: this.state.squareNumber+1, line: 0};

    for(i = 0; i < 6; i++) {
      var lineDif = Math.abs(closeBy[i].line - pressedLine);
      var rowDif = Math.abs(pressedRow - closeBy[i].row);

      if(!closeBy[i].found && lineDif === 0 ) {
        if (!closest.leftRight) {
          closest.lineDist = rowDif;
        }else if (rowDif < closest.lineDist ) {
          closest.lineDist = rowDif;
        }
        closest.leftRight = true;
      }
      if(!closeBy[i].found && !closest.leftRight && lineDif < closest.lineDist ) {
        closest.row = rowDif;
        closest.lineDist = lineDif;
        closest.line = closeBy[i].line - pressedLine;
      }
    }

    var show = closest.leftRight ? closest.lineDist : String.fromCharCode(65 + pressedLine + closest.line);

    allCells[boxNumber] = <td className='td-selected' key={boxNumber} data-key={boxNumber} >{show}</td>

    if (matrixTriesLeft === 0) {
      document.addEventListener("keydown", this.keyboardPressed.bind(this), false);
    }

    this.setState({ cells: allCells, matrixTriesLeft: matrixTriesLeft });
  }

  array = ["??mbito",
    "n??scio",
    "??ndole",
    "exceto",
    "vereda",
    "conv??m",
    "mister",
    "alus??o",
    "in??cuo",
    "infame",
    "anseio",
    "apogeu",
    "m??rito",
    "af??vel",
    "ex??mio",
    "pressa",
    "fac????o",
    "nocivo",
    "aferir",
    "apre??o",
    "escopo",
    "j??bilo",
    "isento",
    "ades??o",
    "adorno",
    "paix??o",
    "c??nico",
    "hostil",
    "eficaz",
    "alheio",
    "id??neo",
    "casual",
    "l??dico",
    "abster",
    "receio",
    "ciente",
    "astuto",
    "idiota",
    "h??bito",
    "c??mico",
    "??xtase",
    "dispor",
    "san????o",
    "sess??o",
    "formal",
    "cess??o",
    "d??vida",
    "ocioso",
    "difuso",
    "escusa",
    "d??diva",
    "alento",
    "decoro",
    "maroto",
    "solene",
    "lograr",
    "avidez",
    "perene",
    "ensejo",
    "l??rico",
    "??nfase",
    "utopia",
    "??mpeto",
    "gentil",
    "legado",
    "eximir",
    "l??baro",
    "l??cito",
    "coagir",
    "al??ada",
    "rancor",
    "cort??s",
    "ot??rio",
    "alocar",
    "inerte",
    "coes??o",
    "julgar",
    "outrem",
    "aludir",
    "sisudo",
    "tamb??m",
    "cobi??a",
    "remoto",
    "t??cito",
    "herege",
    "embora",
    "vedado",
    "prover",
    "asseio",
    "acento",
    "m??todo",
    "altivo",
    "pensar",
    "encher",
    "et??reo",
    "objeto",
    "buscar",
    "patife",
    "inepto",
    "lacuna",
    "agonia",
    "quanto",
    "esteio",
    "danado",
    "acesso",
    "exalar",
    "s??brio",
    "agu??ar",
    "rotina",
    "esbo??o",
    "c??tico",
    "desejo",
    "avante",
    "proeza",
    "nativo",
    "axioma",
    "abjeto",
    "vulgar",
    "deixar",
    "emitir",
    "linear",
    "ad??gio",
    "adepto",
    "cessar",
    "arguir",
    "apatia",
    "passar",
    "id??lio",
    "porfia",
    "ami??de",
    "insano",
    "omisso",
    "gitano",
    "b??n????o",
    "alarde",
    "franco",
    "polido",
    "espa??o",
    "sereno",
    "trazer",
    "emanar",
    "viagem",
    "enxuto",
    "suprir",
    "cismar",
    "acordo",
    "origem",
    "esvair",
    "forjar",
    "m??rtir",
    "ila????o",
    "inibir",
    "faceta",
    "??nfimo",
    "emo????o",
    "anci??o",
    "deriva",
    "cren??a",
    "jamais",
    "men????o",
    "tr??ade",
    "sentir",
    "ex??lio",
    "galgar",
    "limiar",
    "t??pico",
    "atraso",
    "diante",
    "prazer",
    "evocar",
    "servir",
    "penhor",
    "cingir",
    "arrimo",
    "s??bito",
    "in??cio",
    "vetado",
    "ousado",
    "bord??o",
    "s??tira",
    "sempre",
    "esmero",
    "fei????o",
    "prov??m",
    "f??tico",
    "conter",
    "in??til",
    "cassar",
    "ironia",
    "chap??u",
    "s??dito",
    "c??lera",
    "devido",
    "brando",
    "delito",
    "estima",
    "piegas",
    "desd??m",
    "s??dico",
    "tornar",
    "sec????o",
    "coa????o",
    "cerrar",
    "aduzir",
    "inveja",
    "cr??vel",
    "nuance",
    "gl??ria",
    "in??quo",
    "fun????o",
    "amanh??",
    "limite",
    "seguir",
    "evadir",
    "tirano",
    "n??made",
    "clamar",
    "aderir",
    "am??vel",
    "onerar",
    "motriz",
    "l??xico",
    "c??lido",
    "exigir",
    "comigo",
    "l??cido",
    "ex??guo",
    "escuso",
    "v??rias",
    "m??tico",
    "lavrar",
    "p??tria",
    "pleito",
    "embate",
    "grande",
    "clich??",
    "fraude",
    "teoria",
    "loquaz",
    "devoto",
    "pueril",
    "erigir",
    "acatar",
    "abismo",
    "mazela",
    "b??lico",
    "plebeu",
    "f??rias",
    "sabido",
    "talvez",
    "chiste",
    "t??mido",
    "frisar",
    "fulgor",
    "torpor",
    "engodo",
    "tens??o",
    "??ntimo",
    "xingar",
    "perfil",
    "tratar",
    "manter",
    "compor",
    "relato",
    "purgar",
    "of??cio",
    "g??nero",
    "g??nese",
    "dotado",
    "c??lere",
    "peleja",
    "expiar",
    "pr??xis",
    "surgir",
    "credor",
    "prisma",
    "m??cula",
    "colher",
    "exibir",
    "tolher",
    "emenda",
    "ofensa",
    "formos",
    "cont??m",
    "pudico",
    "elogio",
    "mostra",
    "adorar",
    "estado",
    "servil",
    "ceifar",
    "elidir",
    "flor??o",
    "melhor",
    "poente",
    "divino",
    "evas??o",
    "ilidir",
    "dic????o",
    "coibir",
    "pacato",
    "omitir",
    "rapina",
    "propor",
    "alguma",
    "beleza",
    "er??rio",
    "inapto",
    "sermos",
    "acerca",
    "??ndice",
    "pessoa",
    "aurora",
    "quando",
    "demais",
    "prezar",
    "aporte",
    "querer",
    "semear",
    "pr??vio",
    "??spero",
    "matriz",
    "cau????o",
    "arguto",
    "voltar",
    "dilema",
    "obstar",
    "agouro",
    "vermos",
    "abolir",
    "ajudar",
    "pairar",
    "brecha",
    "apesar",
    "asceta",
    "destra",
    "despir",
    "condiz",
    "cativo",
    "charco",
    "aflige",
    "jovial",
    "lastro",
    "flanco",
    "padr??o",
    "??lcool",
    "abonar",
    "arroio",
    "saciar",
    "depois",
    "trevas",
    "efeito",
    "apenas",
    "porvir",
    "oposto",
    "findar",
    "enlace",
    "lisura",
    "exa????o",
    "ventre",
    "acervo",
    "gest??o",
    "colega",
    "vileza",
    "cuidar",
    "aceder",
    "ilus??o",
    "imagem",
    "expert",
    "enigma",
    "cobrir",
    "m??ximo",
    "insumo",
    "motivo",
    "adular",
    "velado",
    "triste",
    "sovina",
    "social",
    "cond??o",
    "pranto",
    "boceta",
    "roubar",
    "sa??ram",
    "burlar",
    "nascer",
    "severo",
    "margem",
    "ufanar",
    "jiboia",
    "primor",
    "fastio",
    "chofer",
    "serrar",
    "avesso",
    "mandar",
    "vieram",
    "pesado",
    "mestre",
    "biltre",
    "t??pico",
    "vi??vel",
    "baleia",
    "imolar",
    "enfado",
    "arauto",
    "sagu??o",
    "captar",
    "grafar",
    "jocoso",
    "f??rtil",
    "estar??",
    "pregar",
    "imerso",
    "prever",
    "desuso",
    "bonito",
    "alegar",
    "descer",
    "miss??o",
    "evitar",
    "fluido",
    "obtuso",
    "regalo",
    "tutela",
    "vexame",
    "evento",
    "perd??o",
    "sentar",
    "tentar",
    "rega??o",
    "quiser",
    "n??tido",
    "fr??gil",
    "tr??gua",
    "remido",
    "mentor",
    "cedi??o",
    "adotar",
    "c??vado",
    "frugal",
    "jun????o",
    "arisco",
    "reaver",
    "c??mulo",
    "b??blia",
    "esfera",
    "safado",
    "perder",
    "convir",
    "afinco",
    "a??oite",
    "v??tima",
    "tarefa",
    "m??xima",
    "primar",
    "labuta",
    "m??ngua",
    "cartel",
    "contar",
    "por????o",
    "l??ngua",
    "lotado",
    "romper",
    "poupar",
    "amante",
    "antigo",
    "imundo",
    "balela",
    "imoral",
    "fulcro",
    "afetar",
    "agente",
    "aflito",
    "abst??m",
    "t??tulo",
    "moroso",
    "r??pido",
    "s??mile",
    "sofrer",
    "dentre",
    "venham",
    "ditoso",
    "fausto",
    "sustar",
    "causar",
    "munido",
    "m??dulo",
    "ciscar",
    "larica",
    "pseudo",
    "zombar",
    "ansiar",
    "v??rios",
    "come??o",
    "modelo",
    "imenso",
    "f??lico",
    "afoito",
  "autuar"];

}
export default App;
