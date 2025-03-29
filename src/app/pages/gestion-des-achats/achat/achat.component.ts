import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FournisseurService } from '../../../services/gestion-des-produits/fournisseur/fournisseur.service';
import { ProduitService } from '../../../services/gestion-des-produits/produit/produit.service';

@Component({
  selector: 'app-achat',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './achat.component.html',
  styleUrl: './achat.component.css'
})
export default class AchatComponent implements OnInit {
  achatForm: FormGroup;
  fournisseurs: any[] = [];
  produits: any[] = [];
  modesPaiement = ['espece', 'carte', 'virement'];
  statuts = ['payer', 'impayer'];

  constructor(
    private fb: FormBuilder,
    private fournisseurService: FournisseurService,
    private produitService: ProduitService
  ) {
    this.achatForm = this.fb.group({
      libelle: ['', Validators.required],
      description: ['', Validators.required],
      montant_total: [0, Validators.required],
      date_achat: ['', Validators.required],
      mode_paiement: ['', Validators.required],
      fournisseur: ['', Validators.required],
      statut: ['', Validators.required],
      detail_achat: this.fb.array([])
    });
  }

  ngOnInit() {
    this.loadFournisseurs();
    this.loadProduits();
  }

  loadFournisseurs() {
    this.fournisseurService.getAllFournisseurs().subscribe({
      next: (response: any) => {
        this.fournisseurs = Array.isArray(response) ? response : response.data || [];
      },
      error: (error) => console.error('Erreur lors du chargement des fournisseurs:', error)
    });
  }

  loadProduits() {
    this.produitService.getAllProduits().subscribe({
      next: (response: any) => {
        this.produits = Array.isArray(response) ? response : response.data || [];
      },
      error: (error) => console.error('Erreur lors du chargement des produits:', error)
    });
  }

  get detailAchat() {
    return this.achatForm.get('detail_achat') as FormArray;
  }

  ajouterDetailAchat() {
    const detailForm = this.fb.group({
      produit: ['', Validators.required],
      prix_unitaire: [0, Validators.required],
      quantite: [0, Validators.required]
    });
    this.detailAchat.push(detailForm);
  }

  supprimerDetailAchat(index: number) {
    if (this.detailAchat.length > 1) {
      this.detailAchat.removeAt(index);
    }
  }

  onSubmit() {
    if (this.achatForm.valid) {
      console.log(this.achatForm.value);
      // TODO: Implémenter l'appel au service pour sauvegarder l'achat
    }
  }
}
