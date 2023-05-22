import { GithubUser } from "./GithubUser.js"

export class favorite {
  constructor (root) {
    this.root = document.querySelector(root)
    this.load()
    this.onAddLine()
    this.noLine()
  }
  
  load() {
    this.entries = JSON.parse(localStorage.getItem('@github-favorites:')) || []
  }

  save () {
    localStorage.setItem('@github-favorites:', JSON.stringify(this.entries))
    this.onAddLine()
    this.noLine()
  }

  onAddLine() {
    if (localStorage.getItem('@github-favorites:') == '[]') {
      this.root.querySelector('.no-favorite').classList.remove('hide')
    }
  }

  noLine() {
    if (localStorage.getItem('@github-favorites:') !== '[]') {
      this.root.querySelector('.no-favorite').classList.add('hide')
    }
  }

  async add(username) {
    try{ 
      const userExists = this.entries.find(entry => entry.login === username)

      if(userExists) {
        throw new Error('Usuario ja existe')
      }

      const user = await GithubUser.search(username)
      
      if(user.login === undefined) {
        throw new Error('usuario não encontrado!')
      }

      this.entries = [user, ...this.entries]
      this.update()
      this.save()

    } catch(error) {
      alert(error.message)
    }

  }      

  delete(user) {
    this.entries = this.entries
     .filter(entry => entry.login !== user.login)

     this.update()
     this.save()
     this.onAddLine()
     this.noLine()
  }
}



export class favoriteView extends favorite {
   constructor (root) {
    super(root)

    this.tbody = this.root.querySelector('table tbody')

    this.update()
    this.onAdd()
   }

   onAdd() {
    const buttonAdd = this.root.querySelector('.search button')
     buttonAdd.onclick = () =>  {
      const { value } = this.root.querySelector('.search input')
      this.add(value)
     }
    }

  update() {
    this.removeAllTr()

    this.entries.forEach( user => {
      const row = this.createRow()
      row.querySelector('.user img').src = `https://github.com/${user.login}.png`
      row.querySelector('.user img').alt = `image de ${user.name}`
      row.querySelector('.user a').href = `https://github.com/${user.login}`
      row.querySelector('.user p').textContent = user.name
      row.querySelector('.user span').textContent = user.login
      row.querySelector('.Repositories').textContent = user.public_repos
      row.querySelector('.Followers').textContent = user.followers

      row.querySelector('.remover').onclick = () => {
        const isOk = confirm(`Are you sure you want to remove ${user.name}`)
        if (isOk) {
          this.delete(user)
        }
      }


      this.tbody.append(row)
    })

  }

  createRow () {

    const tr = document.createElement('tr')
    tr.innerHTML = `
    <td class="user">
      <div>
      <img src="https://github.com/debyrayane.png" alt="image de debyrayane">
      <a href="https://github.com/debyrayane" target="_blank">
        <p>Deborah Rayane</p>
        <span>/debyrayane</span>
      </a>
    </div>
    </td>
    <td class="Repositories">123</td>
    <td class="Followers">1234</td>
    <td class="remover">
      <button>Remover</button>
    </td>
    `
    return tr
  }

  removeAllTr() {
    
    this.tbody.querySelectorAll('tr').forEach( (tr) => {
      tr.remove()
    });
  }
}
