//toujours relancer le serveur dés qu'il y a une modification!
class Entity {// : abstract
    id;//number
}

class Person extends Entity {
    firstname;//string
    lastname;//string
}

class Company extends Entity {
  name; //string
}

// ne sert pas à créer des objets// c'est l'interface entre nos providers et notre repository
//c'est un mode d'emploi pr nos providers
//aspct commercial: barriere car on ne sait pas ce qui se fait derriere

class IDataProvider {//abstract : interface
  // class abstraite donc je ne remplis pas les fonctions
  list() {
    //tableau de Entity , abstract
  }
  search(text) {
    //tableau de Entity, text:string, abstract
  }
}

class BaseProvider extends IDataProvider {//abstract
  getData() {//tableau de Entity abstract
  }
  list() {//tableau de Entity

    //faire preuve d'abstraction
    return this.getData();
  }
  search(text) {//tableau Entity, text: string

    //retourne une liste :d'objet
    let search = text.toLowerCase();// string
    let results = []; // Entity[]
    for (const item of this.getData()) {
      //boucle qui recupere les données : ne selectionne que les valeurs non les clefs
      if (Object.values(item).join(' ').toLowerCase().includes(search)) {
        results.push(item);
      }
    }
    return results;
  }
}

class PersonProvider extends BaseProvider {
  getData() {//tableau de person

    //retourner une liste d'objet Person, text:string
    let p1 = new Person(); //person
    p1.id = 1;
    p1.firstname = "Sophie";
    p1.lastname = "Lozophy";

    let p2 = new Person(); //person
    p2.id = 2;
    p2.firstname = "Annie";
    p2.lastname = "Versaire";

    let p3 = new Person(); //person
    p3.id = 3;
    p3.firstname = "Paul";
    p3.lastname = "Ochon";

    return [p1, p2, p3];
  }
}

class CompanyProvider extends BaseProvider {
  getData() {
    //tableau de company

    //retourner une liste d'objet Company
    let c1 = new Company(); //company
    c1.id = 1;
    c1.name = "Google";

    let c2 = new Company(); //company
    c2.id = 2;
    c2.name = "Apple";

    let c3 = new Company(); //company
    c3.id = 3;
    c3.name = "Microsoft";

    return [c1, c2, c3];
  }
}

class RepositoryService {
  // Dans providers, on a une liste de providers (les objets comme José et Sophie)
  providers; //tableau de Idataprovider

  constructor(providers) {
    // on l'exige lors de l'instanciation des providers : une dependance (prend vie dans notre univers)
    this.providers = providers; //iniciation
  }

  // heritage
  list() {//tableau de Entity, text: string

    //retourne une liste d'objet Person/Company
    //creer une variable pr recup la liste
    let results = [];//Entity[]
    //parcourir la liste PersonProvider et companyProvider
    for (const p of this.providers) {
      // un provider est un IDataProvider et lui n'a que la méthode list. Bertrand ne connaît pas les Person et Company Providers
      results = results.concat(p.list());
    }
    //afficher la liste
    return results;
  }

  search(text) {// tableau de Entity, text: string
    //retourne une liste :d'objet
    //creer une variable pr recup la liste
    let results = [];//Entity[]
    //parcourir search() de PersonProvider et companyProvider
    for (const p of this.providers) {
      results = results.concat(p.search(text));
    }
    //afficher la liste
    return results;
  }
}

// Là, j'instancie mes objets pour qu'ils puissent jouer leur rôle. 
// jose son type est PersonProvider
const jose = new PersonProvider();//personprovider[]
//console.log(jose);

// sophie son type est CompanyProvider
const sophie = new CompanyProvider();//companyprovider[]
//console.log(sophie);

// bertrand son type est RepositoryService
// lié au constructor pour la Construction
const bertrand = new RepositoryService([jose, sophie]);//repositoryservice
//console.log(bertrand.list());
//console.log(bertrand.search('o'));

const express = require('express'); // le mettre dans une variable pr recup tout les exports 
const cors = require('cors'); 

//Creation du serveur, par convention on l'appelle app
let app = express();
//utilisation du middleware cors// autoriser les requetes HTTP provenant d'une autre origine (nom de domaine)
app.use(cors());
//utilisation de JSON // communication avc des données au format JSON
app.use(express.json());

//methode de requete :
// GET (recuperation de données) -search(pr l'exemple, habituellement en GET)
// POST (envoi de données avec une intention de creation)
// PUT (envoi de données avec une intention de modification totale)
// PATCH (envoi de données avec une intention de modification partielle)
// DELETE (suppression de données)
// HEAD (salutation)
// OPTIONS (demande d'autorisation)

// Je crée une fonction pour mes requêtes.
// requete : req
// response : res
app.get('/',function(req,res) {
    //status(202) = succés
    res.status(200).send(bertrand.list());
});

// Creer un nouveau endpoint qui accepte les requêtes en POST avec une donnée "text" à l'interieur du payload
// Renvoyer les resultats de la recherche utilisant la donnée "text" qui a été envoyé.
// Indice : pr recuperer la donnée "text" du payload : req.body.text;

app.post('/search', function(req, res){
    res.send(bertrand.search(req.body.text));
});


// lancer le serveur avec app.listen// indiquer son port et la fonction
app.listen(4000, function() {
    console.log('listening on port 4000 ok!')
})
//pr verifier que le serveur est bien lancé faire via la console :node index.js, puis lancer localhost:3000.