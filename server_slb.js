const SERIAL_PATH = '/dev/ttyS1'
const SERVER_PORT = 5000
const HTTP_SERVER_PORT = 3004

const REFRESH_MS = 50
const L_MIN = 0
const L_MAX = 15 // Range for L value
const C_MIN = 0
const C_MAX = 100 // Range for colour values

const net = require('net')
const http = require('http')
const url = require('url');

const exec = require('child_process').exec

exec(`stty -F ${SERIAL_PATH} 115200`) // Set baudrate

let leds = []
for (let i=0; i<52; i++) {
  leds.push({
    l: L_MIN,
    r: C_MIN,
    g: C_MIN,
    b: C_MIN
  })
}

function scale(num, in_min, in_max, out_min, out_max) {
  if (num < in_min) num = in_min
  if (num > in_max) num = in_max
  return Math.round((num - in_min) * (out_max - out_min) / (in_max - in_min) + out_min)
}

//------------------------------------------------------------------------------ LED REFRESH
setInterval(function() {
  // Concat values into single array, and convert from declared MIN/MAX values to required ranges
  let ledsRanged = leds.map(x => [
    scale(x.l, L_MIN, L_MAX, 0xF0, 0xFF),
    scale(x.b, C_MIN, C_MAX, 0x00, 0x67),
    scale(x.r, C_MIN, C_MAX, 0x00, 0x67),
    scale(x.g, C_MIN, C_MAX, 0x00, 0x67)
  ])
  // Rearrange array to start at top center, and move clockwise
  let temp = []
  for (let i=46; i>=0; i--) {
    temp.push(ledsRanged[i])
  }
  for (let i=51; i>=47; i--) {
    temp.push(ledsRanged[i])
  }
  let bytes = [0x55, 0xAA] // start bytes, constant
  bytes.push(temp)
  bytes.push(0x88)  // end byte, constant
  bytes = bytes.flat(2) // Flatten array of arrays into single array
  bytes = bytes.map(n=>`\\x${n.toString(16).padStart(2, '0').toUpperCase()}`)
  exec(`bash -c "echo -en '${bytes.join('')}' > ${SERIAL_PATH}"`)
}, REFRESH_MS)

//------------------------------------------------------------------------------ SET FUNCTIONS
function setSingle(index, l, r, g, b) {
  // Check inputs
  for (let x of [index, l, r, g, b]) {
    if (typeof x !== 'number') throw new TypeError('All parameters must be numbers')
  }
  if (index < 0 || index > (leds.length - 1)) {
    throw new RangeError(`Index out of bounds (${index})`)
  }
  if (l < L_MIN || l > L_MAX) {
    throw new RangeError(`L value out of bounds (${l}) - Range = ${L_MIN} -> ${L_MAX}`)
  }
  for (let x of [r, g, b]) {
    if (x < C_MIN || x > C_MAX) {
      throw new RangeError(`Colour value out of bounds (${x}) - Range = ${C_MIN} -> ${C_MAX}`)
    }
  }
  leds[index].l = l
  leds[index].r = r
  leds[index].g = g
  leds[index].b = b
}

function setAll(l, r, g, b) {
  for (let i=0; i<52; i++) setSingle(i, l, r, g, b)
}

//------------------------------------------------------------------------------ GET FUNCTIONS
function getSingle(index) {
  if (typeof index !== 'number')
    throw new TypeError('Index must be a number')
  if (index < 0 || index > (leds.length - 1))
    throw new RangeError(`Index out of bounds (${index})`)
  return JSON.stringify(leds[index])
}

function getAll() {
  return JSON.stringify(leds)
}

//------------------------------------------------------------------------------ HTTP SERVER FUNCTIONS
http.createServer(function (req, res) {
  console.log(req.url)  
let params=new url.URLSearchParams(req.url)
let para= params.sort()
    // SET COMMAND
    let action = params.get("action")
    let all = params.get("led")
    let ledNum = parseInt(params.get("led"))
    let l = parseInt(params.get("l"))
    let r = parseInt(params.get("r"))
    let g = parseInt(params.get("g"))
    let b = parseInt(params.get("b"))
    if (action && action.toLowerCase() === 'set') {
      if (r < C_MIN || r > C_MAX || g < C_MIN || g > C_MAX || b < C_MIN || b > C_MAX  || l < L_MIN || l > L_MAX){
        res.writeHead(404);
        res.end();
      }
      else if (all && all.toLowerCase() === 'all') {
        setAll(l, r, g, b)
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write('OK')
        res.end();
        }
      else if (ledNum && ledNum >= 1 && ledNum <= 52) {
        setSingle(ledNum - 1, l, r, g, b)
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write('OK')
        res.end();
      }
      else {
        res.writeHead(404);
        res.end();
      }
    }
    else {
      res.writeHead(404);
      res.end();
    }
  

}).listen(HTTP_SERVER_PORT); 

//------------------------------------------------------------------------------ TCP SERVER FUNCTIONS
let server = net.createServer(onConnection).listen(SERVER_PORT, () => {
  console.log(`Server listening on port ${server.address().port}`)
})

function onConnection(socket) {
  socket.name = socket.remoteAddress + ':' + socket.remotePort
  console.log(socket.name, '> CONNECTED')
  socket.on('data', data => onData(socket, data))
  socket.on('end', () => console.log(socket.name, '> DISCONNECTED') )
}

function onData(socket, data) {
  data = data.toString()
  console.log(socket.name, '>', data.replace('\n', '\\n').replace('\r', '\\r'))
  let match
  try {
    if ((match = data.match(/set (.*?) (\d+),(\d+),(\d+),(\d+)[\r\n]/i))) {
      // SET COMMAND
      let cmd = match[1].toLowerCase()
      let ledNum = parseInt(match[1])
      let l = parseInt(match[2])
      let r = parseInt(match[3])
      let g = parseInt(match[4])
      let b = parseInt(match[5])
      if (cmd === 'all') {
        setAll(l, r, g, b)
        send('OK')
      }
      else if (ledNum && ledNum >= 1 && ledNum <= 52) {
        setSingle(ledNum - 1, l, r, g, b)
        send('OK')
      }
      else {
        logError(socket, 'Invalid SET command')
      }
    }
    else if ((match = data.match(/get (.*?)[\r\n]/i))) {
      // GET COMMAND
      let cmd = match[1].toLowerCase()
      let ledNum = parseInt(match[1])
      if (cmd === 'all') {
        send(socket, getAll())
      }
      else if (ledNum && ledNum >= 1 && ledNum <= 52) {
        send(socket, getSingle(ledNum - 1))
      }
      else {
        logError(socket, 'Invalid GET command')
      }
    }
    else {
      logError(socket, 'Unrecognized command')
    }
  }
  catch (err) {
    logError(socket, err.message)
  }
}

function send(socket, data) {
  socket.write(Buffer.concat([Buffer.from(data), Buffer.from('\n')]))
}

function logError(socket, message) {
  socket.write(`ERROR: ${message}\n`)
  console.error(message)
}
