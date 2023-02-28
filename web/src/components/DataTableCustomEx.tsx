import { TableHead, TableRow, TableCell, Table, TableContainer, TableBody, Toolbar, Typography, Tooltip } from "@mui/material";
import { useState } from "react";

interface DataTableProps{
  title: string,
  headers: string[],
  data: {id:string}[],
  onClick: (id: string) => void,
}

export function DataTableCustom({headers, data, onClick } : DataTableProps) {


  return (
    <TableContainer>
      <Table aria-label="Table">
        <TableHead>
          <TableRow>
            {headers.map((item, index) => (
               <TableCell key={index} align={index == 0 ? 'left' : 'center'} >{item}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row, index) => (
            <TableRow key={row.id} onClick={() => onClick(row.id)}>
              {Object.values(row).map((item:any, index) => {
                  return item !== row.id && 
                  <TableCell key={index} align={index == 1 ? 'left' : 'center'}>{item}</TableCell>
                }
              )}
            </TableRow>
          ))}
        
        </TableBody>
      </Table>
    </TableContainer>
  )
}