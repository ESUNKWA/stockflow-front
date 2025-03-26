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

  createCategorie(categorie: any) {
    return this.http.post(`${this.API_URL}/categorie`, categorie);
  }

  getCategorieById(id: number) {
    return this.http.getById(`${this.API_URL}/categorie`, id);
  }

  updateCategorie(id: number, categorie: any) {
    return this.http.patch(`${this.API_URL}/categorie/${id}`, categorie);
  }

  deleteCategorie(id: number) {
    return this.http.delete(`${this.API_URL}/categorie/${id}`);
  }
}
