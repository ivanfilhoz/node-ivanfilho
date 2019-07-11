const inquirer = require('inquirer')
const chalk = require('chalk')
const data = require('./data.json')

console.log(chalk.green('! ') + chalk.bold('greetings! my name is Ivan.'))
home(true)

const format = text =>
  chalk.gray('> ') + text.replace(/\[(.*)\]/, chalk.blue('$1'))

async function home(first) {
  const quit = (first ? 'nothing' : 'no more questions') + ', thanks'
  const prefix = first ? 'what' : 'what else'
  const { choice } = await inquirer.prompt({
    type: 'list',
    name: 'choice',
    message: `so, ${prefix} do you want to know about me?`,
    choices: [...Object.keys(data), quit]
  })

  if (choice === quit) return answer('okay, see ya!', () => 0)

  return answer(data[choice], home)
}

async function ask(question) {
  const { message, items } = question
  const quit = 'go back'
  const { choice } = await inquirer.prompt({
    type: 'list',
    name: 'choice',
    message,
    choices: [...items.map(item => item.title), quit]
  })

  if (choice === quit) return home()
  const { response } = items.find(item => item.title === choice)

  return answer(response, () => ask(question))
}

async function answer(obj, after) {
  obj = typeof obj === 'string' ? [obj] : obj
  if (!Array.isArray(obj)) return ask(obj)

  obj = obj.map(format).join('\n')
  console.log(`\n${obj}\n`)

  await pause()
  return after()
}

async function pause() {
  const { stdin, stdout } = process

  stdout.write(chalk.gray('press any key to continue...'))
  stdin.setRawMode(true)
  stdin.resume()
  await new Promise(resolve => stdin.on('data', resolve))
  stdin.pause()
  stdin.setRawMode(false)
  stdout.clearLine()
  stdout.cursorTo(0)
}
