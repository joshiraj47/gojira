import {
    faAngleDoubleUp,
    faAnglesDown,
    faAngleUp,
    faBookmark,
    faCircleExclamation,
    faSquareCheck
} from "@fortawesome/free-solid-svg-icons";

export const issueTypeIcons = {
    'task': faSquareCheck,
    'bug': faCircleExclamation,
    'story': faBookmark,
}

export const issueTypeColor = {
    'task': '#4FADE6',
    'bug': '#E44D42',
    'story': '#65BA43'
}

export const issuePriorityIcons = {
    '1': faAngleDoubleUp,
    '2': faAngleUp,
    '3': faAnglesDown
}

export const issuePriorityColor= {
    '1': '#E9494A',
    '2': '#E97F33',
    '3': '#4FADE6'
}
