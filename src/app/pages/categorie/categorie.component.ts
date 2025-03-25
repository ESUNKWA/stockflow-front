import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-categorie',
  imports: [],
  templateUrl: './categorie.component.html',
  styleUrl: './categorie.component.css'
})
export default class CategorieComponent implements OnInit {

  constructor(private router: Router, @Inject(PLATFORM_ID) private platformId: any) {}

  ngOnInit(): void {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        if (isPlatformBrowser(this.platformId)) {
          //this.loadScripts();
        }
      }
    });
  }
  loadScripts() {
    const dynamicScripts = [
      "public/js/lib/jquery.min.js",
      "public/js/plugins/datatables/dataTables.min.js",
      "public/js/plugins/datatables-bs5/js/dataTables.bootstrap5.min.js",
      "public/js/plugins/datatables-responsive/js/dataTables.responsive.min.js",
      "public/js/plugins/datatables-responsive-bs5/js/responsive.bootstrap5.min.js",
      "public/js/plugins/datatables-buttons/dataTables.buttons.min.js",
      "public/js/plugins/datatables-buttons-bs5/js/buttons.bootstrap5.min.js",
      "public/js/plugins/datatables-buttons-jszip/jszip.min.js",
      "public/js/plugins/datatables-buttons-pdfmake/pdfmake.min.js",
      "public/js/plugins/datatables-buttons-pdfmake/vfs_fonts.js",
      "public/js/plugins/datatables-buttons/buttons.print.min.js",
      "public/js/plugins/datatables-buttons/buttons.html5.min.js",
      "public/js/pages/be_tables_datatables.min.js"
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
