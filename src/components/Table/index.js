import {useContext, useState} from "react";
import {Context} from "../../context";
import {
    Box,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TableSortLabel
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

const descendingComparator = (a, b, orderBy) => {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

const getComparator = (order, orderBy) => {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}

const stableSort = (array, comparator) => {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) {
            return order;
        }
        return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
}

export const BaseTable = () => {
    const {state, dispatch} = useContext(Context)
    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('');

    const headCells = [
        {
            id: 'quantity',
            numeric: false,
            disablePadding: true,
            label: 'Anzahl',
        },
        {
            id: 'item',
            numeric: false,
            disablePadding: true,
            label: 'Artikel / Produkt',
        },
        {
            id: 'weight',
            numeric: false,
            disablePadding: true,
            label: 'Gewicht',
        },
        {
            id: 'total_weight',
            numeric: true,
            disablePadding: true,
            label: 'Gewicht (gesamt)',
        },
    ]

    const handleRowDelete = (obj) => {
        const index = state.EXPORT_ARRAY.findIndex((item) => {
            return item === obj
        })

        dispatch({
            type: "SET_EXPORT_DATA",
            payload: [
                ...state.EXPORT_ARRAY.slice(0, index),
                ...state.EXPORT_ARRAY.slice(index + 1)
            ]
        })
    }

    const handleEdit = (obj) => {
        dispatch({
            type: "SET_BASE_EXPORT_FIELDS",
            payload: {
                ...state.BASE_EXPORT_FIELDS,
                quantity: obj.quantity,
                item: obj.item,
                weight: obj.weight,
                total_weight: (obj.quantity * obj.weight),
            }
        })

        dispatch({
            type: "SET_BASE_ACTION",
            payload: "UPDATE"
        })

        const index = state.EXPORT_ARRAY.findIndex((item) => {
            return item === obj
        })

        dispatch({
            type: "SET_BASE_INDEX",
            payload: index
        })

        window.scrollTo(0, 0)
    }

    const handleRowVisible = (obj, action) => {
        const index = state.EXPORT_ARRAY.findIndex((item) => {
            return item === obj
        })

        let temp = JSON.parse(JSON.stringify(state.EXPORT_ARRAY))
        temp[index].visible = action

        dispatch({
            type: "SET_EXPORT_DATA",
            payload: [
                ...temp
            ]
        })
    }

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    return (
        <>
            {
                state.EXPORT_ARRAY.length > 0 &&
                <Box sx={{width: '100%'}}>
                    <TableContainer>
                        <Table
                            sx={{minWidth: 600}}
                            aria-labelledby="tableTitle"
                            size={'small'}
                        >
                            <TableHead>
                                <TableRow>
                                    {headCells.map((headCell) => (
                                        <TableCell key={headCell.id}>
                                            {headCell.label}
                                            <TableSortLabel
                                                active={orderBy === headCell.id}
                                                direction={orderBy === headCell.id ? order : 'asc'}
                                                onClick={event => handleRequestSort(event, headCell.id)}
                                            />
                                        </TableCell>
                                    ))}
                                    <TableCell/>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {stableSort(state.EXPORT_ARRAY , getComparator(order, orderBy)).map((row, index) => {
                                    return (
                                        <TableRow
                                            hover
                                            key={`${row.quantity}_${row.item}_${row.weight}_${index}`}
                                            style={{
                                                backgroundColor: !row.visible && "#F1F1F1",
                                                opacity: !row.visible && "0.6",
                                            }}
                                        >
                                            <TableCell>
                                                {row.quantity}
                                            </TableCell>
                                            <TableCell>
                                                {row.item}
                                            </TableCell>
                                            <TableCell>
                                                {row.weight}
                                            </TableCell>
                                            <TableCell>
                                                {row.total_weight}
                                            </TableCell>
                                            <TableCell align="right" className={"hide_print"}>
                                                {
                                                    row.visible ?
                                                        <IconButton aria-label="invisible" size="small" onClick={(event) =>
                                                            handleRowVisible(row, false)}>
                                                            <VisibilityOffIcon fontSize="inherit"/>
                                                        </IconButton> :
                                                        <IconButton aria-label="visible" size="small" onClick={(event) =>
                                                            handleRowVisible(row, true)}>
                                                            <VisibilityIcon fontSize="inherit"/>
                                                        </IconButton>
                                                }
                                                <IconButton aria-label="edit" size="small" onClick={(event) => handleEdit(row)}>
                                                    <EditIcon fontSize="inherit"/>
                                                </IconButton>
                                                <IconButton aria-label="delete" size="small"
                                                            onClick={(event) => handleRowDelete(row)}>
                                                    <DeleteIcon fontSize="inherit"/>
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            }
        </>
    )
}
