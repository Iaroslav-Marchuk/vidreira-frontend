// import { useState } from 'react';
// import { useSelector } from 'react-redux';

// import {
//   Box,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   Collapse,
//   IconButton,
//   css,
// } from '@mui/material';

// import {
//   KeyboardArrowDown as KeyboardArrowDownIcon,
//   KeyboardArrowUp as KeyboardArrowUpIcon,
// } from '@mui/icons-material';

// import { selectAllOrders } from '../../redux/orders/selectors.js';
// import Order from '../Order/Order.jsx';

// const OrdersList = () => {
//   const allOrders = useSelector(selectAllOrders);

//   return (
//     <TableContainer component={Paper}>
//       <TableHead>
//         <TableRow>
//           <TableCell />
//           <TableCell>EP</TableCell>
//           <TableCell>Cliente</TableCell>
//           <TableCell>Qtde</TableCell>
//           <TableCell>Estado</TableCell>
//           <TableCell>Zona</TableCell>
//           <TableCell>Data</TableCell>
//           <TableCell>Ações</TableCell>
//         </TableRow>
//       </TableHead>
//       <TableBody>
//         <TableRow
//           sx={{ '& > *': { borderBottom: 'unset' } }}
//           className={css.header}
//         >
//           <TableCell>
//             <IconButton size="small" onClick={() => setOpen(!open)}>
//               {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
//             </IconButton>
//           </TableCell>
//           <TableCell>{order.EP}</TableCell>
//           <TableCell>{order.cliente}</TableCell>
//           <TableCell>{order.items.length}</TableCell>
//           <TableCell>{order.status}</TableCell>
//           <TableCell>{order.local.zona}</TableCell>
//           <TableCell>
//             {new Date(order.createdAt).toLocaleDateString()}
//           </TableCell>
//           <TableCell>⚙️</TableCell>
//         </TableRow>

//         {allOrders.map(order => (
//           <CollapsibleRow key={order._id} order={order} />
//         ))}
//       </TableBody>
//     </TableContainer>
//   );
// };

// export default OrdersList;

// // const CollapsibleRow = ({ order }) => {
// //   const [open, setOpen] = useState(false);
// // };
// // {
// /* <>
//       <TableRow
//         sx={{ '& > *': { borderBottom: 'unset' } }}
//         className={css.header}
//       >
//         <TableCell>
//           <IconButton size="small" onClick={() => setOpen(!open)}>
//             {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
//           </IconButton>
//         </TableCell>
//         <TableCell>{order.EP}</TableCell>
//         <TableCell>{order.cliente}</TableCell>
//         <TableCell>{order.items.length}</TableCell>
//         <TableCell>{order.status}</TableCell>
//         <TableCell>{order.local.zona}</TableCell>
//         <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
//         <TableCell>⚙️</TableCell>
//       </TableRow>

//     </> */

// // --------------------------------------------------------------

// // import { useSelector } from 'react-redux';

// // import Order from '../Order/Order.jsx';

// // import { selectAllOrders } from '../../redux/orders/selectors.js';

// // import css from './OrdersList.module.css';

// // import {
// //   Accordion,
// //   AccordionSummary,
// //   AccordionDetails,
// //   AccordionGroup,
// // } from '@mui/joy';

// // const OrdersList = () => {
// //   const allOrders = useSelector(selectAllOrders);

// //   const flattenedRows = allOrders.flatMap(order =>
// //     order.items.map(item => ({
// //       ...item,
// //       itemId: item._id,
// //       orderId: order._id,
// //       EP: order.EP,
// //       cliente: order.cliente,
// //       status: order.status,
// //       createdAt: order.createdAt,
// //       zona: order.local.zona,
// //       operator: order.local.operator,
// //     }))
// //   );

// //   return (
// //     <>
// //       <table className={css.table}>
// //         <thead className={css.header}>
// //           <tr>
// //             <th>#</th>
// //             <th>EP</th>
// //             <th>Cliente</th>
// //             <th>Qtde</th>
// //             <th>Estado</th>
// //             <th>Zona</th>
// //             <th>Data</th>
// //             <th>Ações</th>
// //           </tr>
// //         </thead>
// //       </table>
// //       <AccordionGroup>
// //         {allOrders.map(order => (
// //           <Accordion key={order._id}>
// //             <AccordionSummary>
// //               <table className={css.sumtable}>
// //                 <tbody>
// //                   <tr>
// //                     <td>#</td>
// //                     <td>{order.EP}</td>
// //                     <td>{order.cliente}</td>
// //                     <td>{order.items.length}</td>
// //                     <td>{order.status}</td>
// //                     <td>{order.local.zona}</td>
// //                     <td>{new Date(order.createdAt).toLocaleDateString()}</td>
// //                     <td>Ações</td>
// //                   </tr>
// //                 </tbody>
// //               </table>
// //             </AccordionSummary>
// //             <AccordionDetails>
// //               <table className={css.table}>
// //                 <thead className={css.header}>
// //                   <tr>
// //                     <th>Vidro</th>
// //                     <th>Medida</th>
// //                     <th>Qtde</th>
// //                     <th>Estado</th>
// //                     <th>Data</th>
// //                     <th>Ações</th>
// //                   </tr>
// //                 </thead>
// //                 <tbody>
// //                   {flattenedRows.map((row, index) => (
// //                     <Order
// //                       key={`${row.itemId}-${index}`}
// //                       row={row}
// //                       index={index}
// //                       itemId={row.itemId}
// //                       orderId={row.orderId}
// //                     />
// //                   ))}
// //                 </tbody>
// //               </table>
// //             </AccordionDetails>
// //           </Accordion>
// //         ))}
// //       </AccordionGroup>
// //     </>
// //   );
// // };

// // export default OrdersList;

// // //   return (
// // //     <table className={css.table}>
// // //       <thead className={css.header}>
// // //         <tr>
// // //           <th>#</th>
// // //           <th>EP</th>
// // //           <th>Cliente</th>
// // //           <th>Vidro</th>
// // //           <th>Medida</th>
// // //           <th>Qtde</th>
// // //           <th>Estado</th>
// // //           <th>Zona</th>
// // //           <th>Data</th>
// // //           <th>Ações</th>
// // //         </tr>
// // //       </thead>
// // //       <tbody>
// // //         {flattenedRows.map((row, index) => (
// // //           <Order
// // //             key={`${row.itemId}-${index}`}
// // //             row={row}
// // //             index={index}
// // //             itemId={row.itemId}
// // //             orderId={row.orderId}
// // //           />
// // //         ))}
// // //       </tbody>
// // //     </table>
// // //   );
// // // };
