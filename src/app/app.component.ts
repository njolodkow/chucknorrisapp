import { Component } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { finalize } from "rxjs/operators";

const api = 'https://api.chucknorris.io/';
const server = 'https://my-json-server.typicode.com/njolodkow/chucknorris/';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  title: string = 'chucknorrisapp';
  actualFact: string = "";
  actualFactId: string = null;
  selectedCategory: string = '';
  query: string = '';
  processingRandomFact: boolean = false;
  processingRandomCategoryFact: boolean = false;
  processingQueryFact: boolean = false;
  processingFavourite: boolean = false;
  categories: string[] = [];
  queryText: string = "";
  favouriteFacts: string[] = [];

  constructor(private http: HttpClient) {

  }

  ngOnInit() {

    this.apiCall("categories", null, data => {
      this.categories = data.map(value => {
        return value.length > 0 ? value[0].toUpperCase() + value.substring(1, value.length) : value;
      });
    });

    this.serverGetFavourites(data => {
      this.favouriteFacts = data.map(obj => obj.value);
    });

  }

  onPressRandomFact() {
    this.processingRandomFact = true;
    this.apiCall("random", null, data => {
      this.actualFact = data.value;
      this.actualFactId = data.id;
    }, () => this.processingRandomFact = false);
  }

  onPressRandomCategoryFact() {
    if (this.selectedCategory !== "") {
      this.processingRandomCategoryFact = true;
      this.apiCall("random", ["category", this.selectedCategory], data => {
        this.actualFact = data.value;
        this.actualFactId = data.id;
      }, () => this.processingRandomCategoryFact = false);
    } else
      window.alert("You must choose a category")
  }

  onPressFactByQuery() {
    if (this.queryText !== "") {
      this.processingQueryFact = true;
      this.apiCall("search", ["query", this.queryText], data => {
        if (data.total == 0) {
          this.actualFact = "Not fact was found with given input";
          this.actualFactId = null;
        } else {
          let randomInt = this.getRandomInt(0, data.result.length - 1);
          this.actualFact = data.result[randomInt].value;
          this.actualFactId = data.result[randomInt].id;
        }
      }, () => this.processingQueryFact = false);
    } else
      window.alert("Input can't be empty")
  }

  onChangeCategory(event) {
    this.selectedCategory = event.value.toLowerCase();
  }

  getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  onPressAddFavourite() {
    if (this.actualFact !== "" && this.actualFactId) {
      this.processingFavourite = true;
      if (!this.favouriteFacts.includes(this.actualFact)) {
        this.serverAddToFavourite(() => this.favouriteFacts.push(this.actualFact),
          () => this.processingFavourite = false);
      } else {
        this.processingFavourite = false;
        window.alert("Fact already in favourites");
      }
    }
  }

  apiCall(path: string, parameters: [string, string], success: Function, after: Function = () => { }) {

    let queryParameters = "";
    if (parameters && parameters.length > 1)
      queryParameters = "/?" + parameters[0] + "=" + parameters[1];

    this.http.get(api + 'jokes/' + path + queryParameters).pipe(
      finalize(() => after())
    ).subscribe(
      data => success(data),
      err => {
        if (err.error.message)
          window.alert("Request failed: " + err.error.message)
        else
          window.alert("Request failed: " + err.statusText)
      }
    );
  }

  serverGetFavourites(success: Function, after: Function = () => { }) {

    this.http.get(server + 'facts').pipe(
      finalize(() => after())
    ).subscribe(
      data => success(data),
      err => {
        if (err.error.message)
          window.alert("Request failed: " + err.error.message)
        else
          window.alert("Request failed: " + err.statusText)
      }
    );
  }

  serverAddToFavourite(success: Function, after: Function = () => { }) {

    this.http.post(server + 'facts', { "id": this.actualFactId, "value": this.actualFact }).pipe(
      finalize(() => after())
    ).subscribe(
      data => success(data),
      err => {
        if (err.error.message)
          window.alert("Request failed: " + err.error.message)
        else
          window.alert("Request failed: " + err.statusText)
      }
    );
  }
}

