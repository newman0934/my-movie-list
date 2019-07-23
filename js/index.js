(function () {
  const BASE_URL = 'https://movie-list.alphacamp.io'
  const INDEX_URL = BASE_URL + '/api/v1/movies/'
  const POSTER_URL = BASE_URL + '/posters/'
  const data = [];
  const dataPanel = document.getElementById('data-panel')
  const searchForm = document.getElementById('search')
  const searchInput = document.getElementById('search-input')
  const pagination = document.getElementById('pagination')
  const ITEM_PER_PAGE = 12
  let paginationData = []
  let btnMode = "card"
  let mode = document.querySelector("#mode-icon")
  let page = 1

  //抓取API的資料
  axios.get(INDEX_URL)
    .then((response) => {
		data.push(...response.data.results)
		//displayDataList(data)
		//分頁
		getTotalPages(data)
		getPageData(1, data)		
    }).catch((err) => console.log(err))
  


  //---------函式區----------------------------


  //顯示電影清單
  function displayDataList (data) {   
    let htmlContent = ''
    data.forEach(function (item, index) {
      if(btnMode === "card"){
        htmlContent += `
        <div class="col-sm-3">
          <div class="card mb-2">
            <img class="card-img-top " src="${POSTER_URL}${item.image}" alt="Card image cap">
            <div class="card-body movie-item-body">
              <h6 class="card-title">${item.title}</h5>
            </div>
            <div class="card-footer">
				      <button class="btn btn-primary btn-show-movie" data-toggle="modal" data-target="#show-movie-modal" data-id="${item.id}">More</button>
				      <button class="btn btn-info btn-add-favorite" data-id="${item.id}">+</button>
            </div>
          </div>
        </div>
      ` 
      }else if(btnMode === "list"){
        htmlContent += `
        <div class="container">
          <div class="col-8">
            <h5 class="movie-title">${item.title}</h5>
          </div>           
          <div class="col-4">
            <button class="btn btn-primary btn-show-movie" data-toggle="modal" data-target="#show-movie-modal" data-id="${item.id}">More</button>
            <button class="btn btn-info btn-add-favorite" data-id="${item.id}">+</button>
          </div>
        </div>
      `
      }
    })
    dataPanel.innerHTML = htmlContent
  }
  
  //加入我的最愛
  function addFavoriteItem (id) {
    const list = JSON.parse(localStorage.getItem('favoriteMovies')) || []
    const movie = data.find(item => item.id === Number(id))
    if (list.some(item => item.id === Number(id))) {
      alert(`${movie.title} is already in your favorite list.`)
    } else {
      list.push(movie)
      alert(`Added ${movie.title} to your favorite list!`)
    }
    localStorage.setItem('favoriteMovies', JSON.stringify(list))
  }
  
  //顯示電影明細
  function showMovie (id) {
    // get elements
    const modalTitle = document.getElementById('show-movie-title')
    const modalImage = document.getElementById('show-movie-image')
    const modalDate = document.getElementById('show-movie-date')
    const modalDescription = document.getElementById('show-movie-description')
    // set request url
    const url = INDEX_URL + id

    // send request to show api
    axios.get(url).then(response => {
      const data = response.data.results
      // insert data into modal ui
      modalTitle.textContent = data.title
      modalImage.innerHTML = `<img src="${POSTER_URL}${data.image}" class="img-fluid" alt="Responsive image">`
      modalDate.textContent = `release at : ${data.release_date}`
      modalDescription.textContent = `${data.description}`
    })
  }
  
  //搜尋功能
  searchForm.addEventListener('submit', event => {
    event.preventDefault()	  
    let results = []
    const regex = new RegExp(searchInput.value, 'i')

    results = data.filter(movie => movie.title.match(regex))
    console.log(results)
    //displayDataList(results)
	  getTotalPages(results)
    getPageData(1, results)
  })


	//show所有分頁數
  function getTotalPages (data) {
    let totalPages = Math.ceil(data.length / ITEM_PER_PAGE) || 1
    let pageItemContent = ''
    for (let i = 0; i < totalPages; i++) {
      pageItemContent += `
        <li class="page-item">
          <a class="page-link" href="javascript:;" data-page="${i + 1}">${i + 1}</a>
        </li>
      `
    }
    pagination.innerHTML = pageItemContent
  }

  //取出某頁的資料
  function getPageData (pageNum, data) {
    paginationData = data || paginationData
    let offset = (pageNum - 1) * ITEM_PER_PAGE
    let pageData = paginationData.slice(offset, offset + ITEM_PER_PAGE)
    displayDataList(pageData)
  }

//--------監聽區--------------------------------

  //card、list切換
  mode.addEventListener('click', (event) => {
    if (event.target.classList.contains('fa-th')) {
      btnMode = 'card'
      getPageData(page)
    } else if (event.target.classList.contains('fa-bars')) {
      btnMode = 'list'
      getPageData(page)
    }
  })

  //點擊明細按鈕跟加入最愛按鈕
  dataPanel.addEventListener('click', (event) => {
    if (event.target.matches('.btn-show-movie')) {
      showMovie(event.target.dataset.id)
    }else if(event.target.matches(".btn-add-favorite")){
		  addFavoriteItem(event.target.dataset.id)
	  }
  })

  //點擊分頁
  pagination.addEventListener('click', event => {
    page = event.target.dataset.page
    console.log(event.target.tagName)
    if (event.target.tagName === 'A') {
      getPageData(event.target.dataset.page)
    }
  })

})()