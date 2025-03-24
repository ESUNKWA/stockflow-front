import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { menu } from '../core/menu';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {

  public menuItem: any[] = menu;

  ngOnInit(): void {
   console.log(this.menuItem);
   
  }


}
