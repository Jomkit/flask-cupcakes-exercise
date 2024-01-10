// function modal(){
//     const myModal = document.getElementById('myModal');
//     const myInput = document.getElementById('myInput');

//     myModal.addEventListener('shown.bs.modal', () => {
//     myInput.focus();
//     });    
// }



const BASE_URL = '/api/cupcakes';
class Cupcake {
    constructor(flavor, size, rating, image){
        this.flavor = flavor;
        this.size = size;
        this.rating = rating;
        this.image = image;
    }
}

function cupcakeDetails(cupcake){
    let html = `<li class='list-group-item' id="${cupcake['id']}"><button type="button" class="btn" data-bs-toggle="modal" data-bs-target="#cupcakeModal">${cupcake['flavor']}</button><div class="position-absolute top-0 end-0 mt-2"><button class="btn btnTrash">&#10006;</button></div></li>`;

    return html;
}

function listCupcakes(cupcakes){
    $('ul').html('');   // Reset onscreen list of cupcakes

    for(i=0; i<=cupcakes.length; i++){
        let cupcake = cupcakes[i];
        let html = cupcakeDetails(cupcake);
        $("ul").append(html);
    }
}

async function allCupcakes(){
    const resp = await axios.get(BASE_URL);
    listCupcakes(resp.data['cupcakes']);
    
    return resp;
}

allCupcakes();

// functionality for deleting cupcake
// $('.btnTrash').on('click', deleteCupcake);

async function deleteCupcake(id){
    const resp = await axios.delete(`${BASE_URL}/${id}`);
    $(`#${id}`).remove();

    return resp;
}

$('ul').click(eventHandler);

async function eventHandler(evt){


    if(evt.target.classList.contains('btnTrash')){
        // Delete cupcake from db and DOM
        console.log('Delete');
        const cupcake = evt.target.parentNode.parentNode;
        console.log(cupcake.id);
        deleteCupcake(cupcake.id);
        return;
    }
    else if(evt.target.tagName == 'BUTTON'){
        // click on cupcake to get cupcake info from modal, rewriting 
        // html to provide image, and cupcake details on the modal
        let cup_id = evt.target.parentNode.id;
        let resp = await axios.get(`${BASE_URL}/${cup_id}`);
        let cupcake = resp.data.cupcake;

        $('.modal-title').html(`<h2 class="display-4">Cupcake Details</h2>`);
        $('.cupcake-img').html(`
            <img src="${cupcake['image']}" class="img-fluid" alt="Cupcake Image">
            `);
        $('.cupcake-details').html(`
            <p><strong>Flavor:</strong> ${cupcake['flavor']}</p>
            <p><strong>Size:</strong> ${cupcake['size']}</p>
            <p><strong>Rating:</strong> ${cupcake['rating']}</p>
            `)
        return;
    }
};

// Handle cupcake form submission
$('#cupcake-add-form').on('submit', addCupcakeForm);

async function addCupcakeForm(e){
    e.preventDefault();
    const cupcakeData = $('.cc-deets');

    let serialized = {};
    for(let i in cupcakeData){
        serialized[cupcakeData[i]['name']] = cupcakeData[i]['value'];
    }
    resp = await axios.post(BASE_URL, serialized);
    let html = cupcakeDetails(resp.data.cupcake);
    $('ul').append(html);

    $('#cupcake-add-form').trigger('reset');
    return resp;
}

// Handle cupcake detail changes

// Handle searching for cupcake
// $('#search-cupcake-form').on('submit', searchCupcakeForm);
$('#search-cupcake').on('keyup', searchCupcakeForm);

async function searchCupcakeForm(e){
    e.preventDefault();
    const searchTerm = $('#search-cupcake').val();
    resp = await axios.get(`${BASE_URL}/search?term=${searchTerm}`);
    listCupcakes(resp.data.cupcakes);

    return resp;
}