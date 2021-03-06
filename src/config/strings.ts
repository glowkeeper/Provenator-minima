class App {

  static readonly title = 'Minima'
  static readonly appName = 'Provenator'
  static readonly catchLine = 'Digital asset provenance on the blockchain'
  static readonly tagline = ''
  static readonly copyright = '© Copyright 2020 Minima GmbH'
  static readonly author = '[Steve Huckle](https://glowkeeper.github.io/)'
  static readonly email = 'steve dot huckle at minima dot global'
  static readonly version = '0.1.1'
}

class Paths {

  // AppBar
  static readonly home = 'Home'
  static readonly blockchain = 'Blockchain'
  static readonly about = 'About'
  static readonly help = 'Help'
  static readonly faq = 'FAQ'
  static readonly contact = 'Contact'

  static readonly listFiles = 'List Files'
  static readonly addFile = 'Add a File'
  static readonly addCheckedFile = Paths.addFile
  static readonly checkFile = `Check a File`
}


class Blockchain {

  static heading = 'Blockchain Info'
}

class GeneralError {

    static readonly required = "Required"
    static readonly random = "random number failed!"
}

class Transaction {

    static readonly pending = "Please wait - transaction is pending"
    static readonly unnecessary = `File already on ${App.title}`
    static readonly success = `Added to ${App.title} successfully. The hash will not appear in your list until the Tx has been mined`
    static readonly failure = 'Hash addition Failed!'

    static readonly errorGettingData = "Error getting data"
}

class Home {

  static readonly heading = 'Home'

  static readonly info = `<h3>${App.catchLine}</h3>${App.appName} is an application for proving the origins of captured digital media. It uses cryptographic tools and blockchain technology. By using the trust mechanisms of blockchains, the application aims to show, beyond doubt, the provenance of any source of digital media.<br/><br/>Provenance plays an essential role in the information era because it adds integrity and authenticity to the data we all consume. Verifiable provenance discourages impropriety by increasing the transparency and accountability of digital assets. However, formal verification of digital media is challenging. Fortunately, blockchains offer innovative solutions to those challenges by giving content creators the tools that allow them to establish the ownership of their creations.`
}

class About {

  static readonly heading = `About ${App.appName}`

  static readonly info = `**${App.appName}** version ${App.version}<br /><br />Created by _${App.author}_<br /><br />${App.copyright}`
}

class Help {

  static readonly heading = `${App.appName} Help`

  static readonly info = `Use **${App.appName}** to prove the provenance of your digital files. <br/><br/>Select _${Paths.addFile}_ to add a file to ${App.title}.<br/><br/>Select _${Paths.checkFile}_ to examine whether a file has already been added to ${App.title} - if it has not, then _${Paths.checkFile}_ redirects to _${Paths.addFile}_.<br/><br/>Select _${Paths.listFiles}_ to list the files you have already added to ${App.title}.`

  static readonly helpTip = 'Help'
  static readonly contactTip = 'Contact'
  static readonly aboutTip = 'About'
  static readonly blockchainTip = `${App.title} blockchain status`
}

class Faq {

  static readonly heading = 'FAQ'

  static readonly info = `Coming soon`
}

class Contact {

  static readonly heading = 'Contact'

  static readonly info = `${App.email}`
}

class File {

    static readonly headingAddFile = "Add a File"
    static readonly headingCheckFile = "Check a File"
    static readonly getFile = "Load"
    static readonly checkFile = "Load a File to Check"
    static readonly noBlock = "n/a"
    static readonly fileTip = "Load a file to be hashed"
    static readonly fileName = "Filename"
    static readonly hash = "Hash"
    static readonly checkTip = `Check the hash of the file exists on ${App.title}`
    static readonly submitTip = `Add the hash of the file to ${App.title}`
    static readonly loadingError = "File did not load"

    static readonly addFileButton = `Add`
    static readonly checkFileButton = `Check`
}

class Files {

    static readonly heading = "Files"
    static readonly listFilesInfo = "(If you just added a file, you may need to wait for its hash to be mined before it appears here)"
    static readonly hash = "Hash"
    static readonly fileName = "Name"
    static readonly block = "Block"
}

export { App,
         Paths,
         Blockchain,
         GeneralError,
         Transaction,
         Home,
         About,
         Help,
         Faq,
         Contact,
         File,
         Files
       }
