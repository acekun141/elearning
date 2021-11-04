import React from "react";
import { IoPencil } from "react-icons/io5";
import { currencyValue } from "./num";

export const LIST_COURSE_TYPE = ["Development", "Business", "IT & Software", "Design", "Marketing", "Music", "Health"]

export const USER_LIST_TABLE = (onChangeRole, isAdmin=false, user_id=null) => [
    {
        name: "ID",
        cell: row => row.id
    },
    {
        name: "First Name",
        cell: row => row.first_name
    },
    {
        name: "Last Name",
        cell: row => row.last_name
    },
    {
        name: "Role",
        cell: row => row.role,
    },
    {
        name: "Deactivate",
        cell: row => row.deactivate ? "True" : "False",
    },
    {
        cell: row => (
            (isAdmin && user_id !== row.id) && (
                <button className="icon-button" onClick={() => onChangeRole(row)}>
                    <IoPencil />
                </button>
            )
        ),
        right: true,
        width: "100px",
    }
]

export const TOP_TEACHER_TABLE = () => [
    {
        name: "ID",
        cell: row => row.id
    },
    {
        name: "First Name",
        cell: row => row.first_name
    },
    {
        name: "Last Name",
        cell: row => row.last_name
    },
    {
        name: "Total",
        cell: row =>  currencyValue(row.total),
        right: true,
    }
]

export const COURSE_INCOME_TABLE = () => [
    {
        name: "Course ID",
        cell: row => row.course_id
    },
    {
        name: "Name",
        cell: row => row.name
    },
    {
        name: "Type",
        cell: row => row.course_type
    },
    {
        name: "Total",
        cell: row =>  currencyValue(row.total),
        right: true,
    }
]