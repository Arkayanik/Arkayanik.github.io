import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnInit {

  conditionList = ["Brand New", "Second Hand", "Refurbished"];
  productForm !: FormGroup;
  actionName : String = "Save";

  constructor(
    private formbuilder: FormBuilder, 
    private api: ApiService, 
    @Inject(MAT_DIALOG_DATA) public rowData: any, 
    private dialogRef: MatDialogRef<DialogComponent>) { }

  ngOnInit(): void {
    this.productForm = this.formbuilder.group({
        productName: ['', Validators.required],
        brand: ['', Validators.required],
        releaseDate: ['', Validators.required],
        condition: ['', Validators.required],
        price: ['', Validators.required],
        quantity: ['', Validators.required]
    })

    if(this.rowData) {
      this.actionName = "Update";
      this.productForm.controls['productName'].setValue(this.rowData.productName);
      this.productForm.controls['brand'].setValue(this.rowData.brand);
      this.productForm.controls['releaseDate'].setValue(this.rowData.releaseDate);
      this.productForm.controls['condition'].setValue(this.rowData.condition);
      this.productForm.controls['price'].setValue(this.rowData.price);
      this.productForm.controls['quantity'].setValue(this.rowData.quantity);
    }
  }

  addProduct(): void {
    if(this.productForm.valid) {
      this.api.postProduct(this.productForm.value).subscribe({
        next: (respond) => {
          alert("Product Added Successfully!");
          this.productForm.reset();
          this.dialogRef.close('save');
        },
        error: () => {
          alert("Error while adding product!");
        }
      })
    }
  }

  updateProduct(): void {
    this.api.putProduct(this.productForm.value, this.rowData.id).subscribe({
      next: (respond) => {
        alert("Product updated Successfully!");
        this.productForm.reset();
        this.dialogRef.close('update');
      },
      error: () => {
        alert("Error while updating product!");
      }
    })
  }

  actionButton(): void {
    (this.actionName === "Save") ? this.addProduct() : this.updateProduct();
  }
}
