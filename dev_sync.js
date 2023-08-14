const Logger = require('roosevelt-logger')
this.logger = new Logger()
const Rsync = require('rsync')
const DEST_DIR = process.env.DEST_DIR
const SRC_DIR = __dirname
const fs = require('fs')

try {
  if (DEST_DIR === '') {
    this.logger.error('ERROR: DEST_DIR is an empty variable')
  } else if (DEST_DIR === SRC_DIR) {
    this.logger.error('ERROR: DEST_DIR is pointing to the same path as SRC_DIR ')
  } else {
    if (fs.existsSync(`${DEST_DIR}/node_modules/roosevelt/`)) {
      this.logger.info('💭', 'We are in a Roosevelt app ...')
      fsWatch()
    } else {
      this.logger.info('')
      this.logger.warn('Make sure the above directories are correct or this could delete unwanted files!')
      this.logger.info('💭', 'We are not in a Roosevelt app ...')
      this.logger.info('')
      fsWatch()
    }
  }
} catch (err) { console.log(err) }

async function fsWatch () {
  const Logger = require('roosevelt-logger')
  this.logger = new Logger()
  const watch = await import('watcher')
  const Watcher = watch.default
  const watcher = new Watcher(DEST_DIR)

  watcher.on('error', error => {
    this.logger.err(error)
  })

  const rsync = new Rsync()
    .flags('avz')
    .delete()
    .exclude('.DS_Store')
    .source(`${DEST_DIR}/node_modules/roosevelt/`)
    .destination(SRC_DIR)

  rsync.execute(function (error, code, cmd) {
    if (error) {
      this.logger.err(error.message)
    }
  })

  this.logger.info('💭', 'Roosevelt fswatch rsync tool running...')
  this.logger.info('')
  this.logger.info('💭', `Now watching: ${SRC_DIR}`)
  this.logger.info('💭', `Will copy to: ${DEST_DIR}`)
  this.logger.info('')
}
