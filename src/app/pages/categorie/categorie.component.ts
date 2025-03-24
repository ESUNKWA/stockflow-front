import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { isPlatformBrowser, NgFor, NgIf, CommonModule } from '@angular/common';
import { CategorieService } from '../../services/categorie/categorie.service';

interface Categorie {
  id: number;
  nom: string;
  description: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

@Component({
  selector: 'app-categorie',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './categorie.component.html',
  styleUrl: './categorie.component.css'
})
export default class CategorieComponent implements OnInit {
  categories: Categorie[] = [];
  isLoading: boolean = false;
  showModal: boolean = false;

  constructor(
    private router: Router,
    private categorieService: CategorieService,
    @Inject(PLATFORM_ID) private platformId: any
  ) {}

  ngOnInit(): void {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        if (isPlatformBrowser(this.platformId)) {
          this.loadScripts();
        }
      }
    });
    this.loadCategories();
  }

  loadCategories(): void {
    this.isLoading = true;
    this.categorieService.getAllCategories().subscribe({
      next: (response: any) => {
        if (response.status === 'success' && response.data) {
          this.categories = response.data;
        }
        this.isLoading = false;
        setTimeout(() => this.initDataTable(), 100);
      },
      error: (error: any) => {
        this.isLoading = false;
      }
    });
  }

  openAddModal(): void {
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
  }

  initDataTable(): void {
    if (isPlatformBrowser(this.platformId)) {
      const $ = (window as any).$;
      if ($ && $.fn.dataTable) {
        $('.js-dataTable-buttons').DataTable({
          responsive: true,
          language: {
            search: 'Rechercher',
            lengthMenu: 'Afficher _MENU_ entrées',
            info: 'Affichage de _START_ à _END_ sur _TOTAL_ entrées'
          }
        });
      }
    }
  }

  loadScripts() {
    const dynamicScripts = [
      "/js/codebase.app.min.js",
      "/js/plugins/chart.js/chart.umd.js",
      "/js/pages/be_pages_dashboard.min.js",
      "/js/lib/jquery.min.js",
      "/js/plugins/datatables/dataTables.min.js",
      "/js/plugins/datatables-bs5/js/dataTables.bootstrap5.min.js",
      "/js/plugins/datatables-responsive/js/dataTables.responsive.min.js",
      "/js/plugins/datatables-responsive-bs5/js/responsive.bootstrap5.min.js",
      "/js/plugins/datatables-buttons/dataTables.buttons.min.js",
      "/js/plugins/datatables-buttons-bs5/js/buttons.bootstrap5.min.js",
      "/js/plugins/datatables-buttons-jszip/jszip.min.js",
      "/js/plugins/datatables-buttons-pdfmake/pdfmake.min.js",
      "/js/plugins/datatables-buttons-pdfmake/vfs_fonts.js",
      "/js/plugins/datatables-buttons/buttons.print.min.js",
      "/js/plugins/datatables-buttons/buttons.html5.min.js",
      "/js/pages/be_tables_datatables.min.js"
    ];
    
    dynamicScripts.forEach(script => {
      const node = document.createElement('script');
      node.src = script;
      node.type = 'text/javascript';
      node.async = false;
      document.body.appendChild(node);
    });
  }
}
