import {Button, Fab, Grid, Menu, MenuItem, TextField} from "@mui/material";
import * as React from "react";
import {useContext, useState} from "react";
import {Context} from "../../context";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import {JsonExport} from "../../helpers/export";
import {JsonImport} from "../../helpers/import";
import {initialState} from "../../context/reducers/initialStates";
import AddIcon from "@mui/icons-material/Add";
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import {BaseTable} from "../Table";

export const BaseHeader = () => {
    const {state, dispatch} = useContext(Context)
    const [anchorElMenu, setAnchorElMenu] = useState(null)
    const openMenu = Boolean(anchorElMenu);
    const handleClickOpenMenu = (event) => {
        setAnchorElMenu(event.currentTarget)
    };
    const handleCloseMenu = () => {
        setAnchorElMenu(null)
    };

    const handleImport = (rawData) => {
        setAnchorElMenu(null)
        JsonImport(rawData, state, dispatch)
    };

    const handleExportConfig = () => {
        setAnchorElMenu(null)
        JsonExport(state)
    };

    return (
        <>
            <Grid container className={"hide_print"}>
                <Grid item md={8} lg={8} xl={8}>
                    <h1>Packliste</h1>
                </Grid>
                <Grid item md={4} lg={4} xl={4}
                      style={{display: "flex", justifyContent: "end", alignItems: "center", paddingRight: "5px"}}>

                    <Button
                        variant="contained"
                        component="label"
                        size={"small"}
                        style={{height: "40px", margin: "0 10px"}}
                    >
                        Import
                        <input
                            type="file"
                            accept="application/json"
                            hidden
                            onChange={(e) => {
                                handleImport(e.target.files[0])
                                e.target.value = null
                            }}
                        />
                    </Button>
                    <Button
                        id="save-button"
                        variant="contained"
                        disableElevation
                        size={"small"}
                        style={{height: "40px"}}
                        onClick={handleClickOpenMenu}
                        endIcon={<KeyboardArrowDownIcon/>}
                    >
                        Speichern
                    </Button>
                    <Menu
                        id="basic-menu"
                        anchorEl={anchorElMenu}
                        open={openMenu}
                        onClose={handleCloseMenu}
                        MenuListProps={{
                            'aria-labelledby': 'basic-button',
                        }}
                        anchorOrigin={{
                            vertical: "bottom",
                            horizontal: "right",
                        }}
                        transformOrigin={{
                            vertical: "top",
                            horizontal: "right",
                        }}
                        style={{marginTop: "5px"}}
                    >
                        <MenuItem onClick={handleExportConfig}>
                            Liste exportieren
                        </MenuItem>
                    </Menu>
                </Grid>
            </Grid>
            <hr/>
        </>
    )
}


export const BaseLayout = () => {
    const {state, dispatch} = useContext(Context)

    const handleChangeTextfield = (event) => {
        dispatch({
            type: "SET_BASE_EXPORT_FIELDS",
            payload: {
                ...state.BASE_EXPORT_FIELDS,
                [event.target.id]: event.target.value
            }
        })
    }

    const handleRowAdd = () => {
        const quantity = parseFloat(state.BASE_EXPORT_FIELDS.quantity)
        const weight = parseFloat(state.BASE_EXPORT_FIELDS.weight)

        const insertData = {
            quantity: quantity,
            item: state.BASE_EXPORT_FIELDS.item,
            weight: weight,
            total_weight: (quantity * weight),
            visible: true
        }

        dispatch({
            type: "ADD_EXPORT_DATA",
            payload: insertData
        })

        // Reset fields
        dispatch({
            type: "SET_BASE_EXPORT_FIELDS",
            payload: initialState.BASE_EXPORT_FIELDS
        })
    }

    const handleRowSave = () => {
        const quantity = parseFloat(state.BASE_EXPORT_FIELDS.quantity)
        const weight = parseFloat(state.BASE_EXPORT_FIELDS.weight)

        const updateItem = {
            quantity: quantity,
            item: state.BASE_EXPORT_FIELDS.item,
            weight: weight,
            total_weight: (quantity * weight),
            visible: state.BASE_EXPORT_FIELDS.visible
        }

        let temp = JSON.parse(JSON.stringify(state.EXPORT_ARRAY))
        temp[state.BASE_INDEX] = updateItem

        dispatch({
            type: "SET_EXPORT_DATA",
            payload: [
                ...temp
            ]
        })

        dispatch({
            type: "SET_BASE_ACTION",
            payload: "CREATE"
        })

        // Reset fields
        dispatch({
            type: "SET_BASE_EXPORT_FIELDS",
            payload: initialState.BASE_EXPORT_FIELDS
        })
    }

    return (
        <>
            <Grid container spacing={1} className={"hide_print"}>
                <Grid item md={10} lg={10} xl={10}/>
                <Grid item md={2} lg={2} xl={2} style={{
                    display: "flex",
                    justifyContent: "end",
                    alignItems: "center",
                    paddingTop: "20px",
                    paddingRight: "5px",
                    paddingBottom: "20px",
                }}>
                    {
                        state.BASE_ACTION === "CREATE" &&
                        <Fab
                            color="primary"
                            size="small"
                            aria-label="add"
                            disabled={
                                !state.BASE_EXPORT_FIELDS.item ||
                                !state.BASE_EXPORT_FIELDS.weight ||
                                state.BASE_EXPORT_FIELDS.quantity === 0 ||
                                !state.BASE_EXPORT_FIELDS.quantity
                            }
                        >
                            <AddIcon onClick={(event) => handleRowAdd()}/>
                        </Fab>
                    }
                    {
                        state.BASE_ACTION === "UPDATE" &&
                        <>
                            <Fab
                                color="primary"
                                size="small"
                                aria-label="save"
                                style={{marginRight: "10px"}}
                            >
                                <SaveIcon
                                    onClick={(event) => handleRowSave()}
                                />
                            </Fab>
                            <Fab color="default" size="small">
                                <CancelIcon onClick={(event) => {
                                    dispatch({
                                        type: "SET_BASE_ACTION",
                                        payload: "CREATE"
                                    })

                                    dispatch({
                                        type: "SET_BASE_EXPORT_FIELDS",
                                        payload: initialState.BASE_EXPORT_FIELDS
                                    })
                                }}/>
                            </Fab>
                        </>
                    }
                </Grid>
            </Grid>
            <Grid container spacing={1} className={"hide_print"}>
                <Grid item xs={3} md={3} lg={3} xl={3}>
                    <TextField
                        id="quantity"
                        required
                        autoComplete={"false"}
                        label={'Anzahl'}
                        name={'quantity'}
                        value={state.BASE_EXPORT_FIELDS.quantity}
                        onChange={handleChangeTextfield}
                        fullWidth
                        InputProps={{
                            inputMode: 'numeric',
                            inputProps: {
                                min: 0
                            }
                        }}
                        type={'number'}
                    />
                </Grid>
                <Grid item xs={6} md={6} lg={6} xl={6}>
                    <TextField
                        id="item"
                        required
                        autoComplete={"false"}
                        label={'Artikel / Produkt'}
                        name={'item'}
                        value={state.BASE_EXPORT_FIELDS.item}
                        onChange={handleChangeTextfield}
                        fullWidth
                        type={'text'}
                    />
                </Grid>
                <Grid item xs={3} md={3} lg={3} xl={3}>
                    <TextField
                        id="weight"
                        required
                        autoComplete={"false"}
                        label={'Gewicht (g)'}
                        name={'weight'}
                        value={state.BASE_EXPORT_FIELDS.weight}
                        onChange={handleChangeTextfield}
                        fullWidth
                        InputProps={{
                            inputMode: 'numeric',
                            inputProps: {
                                min: 0
                            }
                        }}
                        type={'number'}
                    />
                </Grid>
            </Grid>
            <Grid container spacing={1}>
                {
                    state.EXPORT_ARRAY.length > 0 &&
                    <Grid item xs={12} md={12} lg={12} xl={12} style={{
                        display: "flex",
                        justifyContent: "end",
                        alignItems: "center",
                        paddingTop: "20px",
                        paddingRight: "5px",
                        paddingBottom: "20px",
                    }}>
                        <h4>Gesamtgewicht: &nbsp;&nbsp;&nbsp;{
                            state.EXPORT_ARRAY.filter((obj) => obj.visible)
                                .map((item) => item.total_weight).reduce((sum, key) =>
                                sum + key, 0)
                        } (g)
                        </h4>
                    </Grid>
                }
            </Grid>
            <Grid container spacing={1} className={"data-table"}>
                <BaseTable/>
            </Grid>
        </>
    )
}
