import { Injectable } from '@angular/core';
import { environnement } from '../../../environnement/environnement';
import { HttpClientService } from '../../http-client/http-client.service';


@Injectable({
  providedIn: 'root'
})
export class FournisseurService {
  private readonly API_URL = environnement.API_URL;

  constructor(private http: HttpClientService) { }

  getAllFournisseurs() {
    return this.http.get(`${this.API_URL}/fournisseur`);
  }

  saveFournisseur(fournisseur: any) {
    return this.http.post(`${this.API_URL}/fournisseur`, fournisseur);
  }

  getFournisseurById(id: number) {
    return this.http.get(`${this.API_URL}/fournisseur/${id}`);
  }

  updateFournisseur(id: number, fournisseur: any) {
    return this.http.put(`${this.API_URL}/fournisseur/${id}`, fournisseur);
  }

  deleteFournisseur(id: number) {
    return this.http.delete(`${this.API_URL}/fournisseur/${id}`);
  }

}
