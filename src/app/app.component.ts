import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogComponent } from './dialog/dialog.component';
import { ApiService } from './services/api.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Product-Records-App';
  displayedColumns: string[] = ['productName', 'brand', 'releaseDate', 'condition', 'price', 'quantity', 'actions'];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;


  constructor(private dialog: MatDialog, private api: ApiService) {
  }
  ngOnInit(): void {
    this.getAllProducts();
  }

  getAllProducts() {
    this.api.getProduct().subscribe({
      next: (respond) => {
        console.log(respond);
        this.dataSource = new MatTableDataSource(respond);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error: () => {
        alert("Error while fetching the records!");
      }
    })
  }
  addProduct() {
    this.dialog.open(DialogComponent, {
      width: '30%'
    }).afterClosed().subscribe(value => {
        this.getAllProducts();
    });
  }
  editProduct(row: any) {
    this.dialog.open(DialogComponent, {
      width: '30%',
      data: row
    }).afterClosed().subscribe(value => {
        this.getAllProducts();
    });
  }
  confirmDeleteProduct(id: number) {
    let result = confirm('Are you sure you wanna delete this product?');
    console.log(result);
    if(result) {
      this.deleteProduct(id);
    }
  }
  deleteProduct(id: number) {
    this.api.deleteProduct(id).subscribe({
      next: (respond) => {
        alert("Product successfully deleted!");
        this.getAllProducts();
      },
      error: () => {
        alert("Error while deleting the records!");
      }
    })
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}

