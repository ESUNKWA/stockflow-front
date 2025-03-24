import { Injectable } from '@angular/core';
import { HttpClientService } from '../http-client/http-client.service';
import { environnement } from '../../environnement/environnement';


@Injectable({
  providedIn: 'root'
})
export class CategorieService {
  private readonly API_URL = environnement.API_URL;

  constructor(private http: HttpClientService) { }

  getAllCategories() {
    return this.http.get(`${this.API_URL}/categorie`);
  }
}
