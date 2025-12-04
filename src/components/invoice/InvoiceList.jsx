"use client";
import {
  deleteInvoice,
  getInvoices,
  markAsPaid,
  markAsPending,
} from "@/actions/invoiceActions";
import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import Link from "next/link";
import { CheckCircle, Clock, Edit, Eye, MoreHorizontal, Plus, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Badge } from "../ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { toast } from "sonner";

export default function InvoiceList({ initialInvoices }) {
  const [invoices, setInvoices] = useState(initialInvoices);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [invoiceToDelete, setInvoiceToDelete] = useState(null);

  const getAllInvoices = async () => {
    const result = await getInvoices();
    if (result.success) {
      setInvoices(result.data);
    }
  };

  const handleDelete = async (id) => {
    const result = await deleteInvoice(id);
    if (result.success) {
      setInvoices(invoices.filter((inv) => inv.id !== id));
      toast.success("Invoice deleted successfully");
    } else {
      toast.error("Failed to delete invoice: " + result.error);
    }
    setDeleteDialogOpen(false);
    setInvoiceToDelete(null);
  };

  const confirmDelete = (id) => {
    setInvoiceToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleMarkPaid = async (id) => {
    const result = await markAsPaid(id);
    if (result.success) {
      toast.success("Invoice marked as paid");
      getAllInvoices();
    } else {
      toast.error("Failed to mark as paid: " + result.error);
    }
  };

  const handleMarkPending = async (id) => {
    const result = await markAsPending(id);
    if (result.success) {
      toast.success("Invoice marked as pending");
      getAllInvoices();
    } else {
      toast.error("Failed to mark as pending: " + result.error);
    }
  };

  const getStatusVariant = (status) => {
    switch (status) {
      case "PAID":
        return "default";
      case "OVERDUE":
        return "destructive";
      default:
        return "secondary";
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (invoices.length === 0) {
    return (
      <Card className="border-dashed">
        <CardHeader className="text-center">
          <CardTitle className="text-xl">No invoices found</CardTitle>
          <CardDescription>
            Get started by creating your first invoice
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <Button asChild>
            <Link href="/invoices/new">
              <Plus className="mr-2 h-4 w-4" />
              Create First Invoice
            </Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">S/N</TableHead>
              <TableHead>Purpose</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoices.map((invoice, index) => (
              <TableRow key={invoice.id}>
                <TableCell className="font-medium">#{index + 1}</TableCell>
                <TableCell>{invoice.purpose}</TableCell>
                <TableCell className={"text-muted-foreground"}>
                  {invoice.customerEmail}
                </TableCell>
                <TableCell>${invoice.amount}</TableCell>
                <TableCell>
                  <Badge variant={getStatusVariant(invoice.status)}>
                    {invoice.status}
                  </Badge>
                </TableCell>
                <TableCell>{formatDate(invoice.dueDate)}</TableCell>
                <TableCell className={"text-right"}>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem asChild>
                        <Link
                          href={`/invoices/${invoice.id}`}
                          className="cursor-pointer"
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={`/invoices/${invoice.id}/edit`} className="cursor-pointer">
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </Link>
                      </DropdownMenuItem>

                      <DropdownMenuSeparator />
                      {invoice.status !== 'PAID' && (
                        <DropdownMenuItem onClick={() => handleMarkPaid(invoice.id)}>
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Mark as Paid
                        </DropdownMenuItem>
                      )}
                      {invoice.status === 'PAID' && (
                        <DropdownMenuItem onClick={() => handleMarkPending(invoice.id)}>
                          <Clock className="mr-2 h-4 w-4" />
                          Mark as Pending
                        </DropdownMenuItem>
                      )}

                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-destructive focus:text-destructive"
                        onClick={() => confirmDelete(invoice.id)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>

                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

       <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the invoice
              and remove it from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => handleDelete(invoiceToDelete)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>     

    </>
  );
}
