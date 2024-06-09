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

export const issueTypes = [
    'task', 'bug', 'story'
]

export const issueTypeColor = {
    'task': '#4FADE6',
    'bug': '#E44D42',
    'story': '#65BA43'
}

export const issuePriorityIcons = {
    'high': faAngleDoubleUp,
    'medium': faAngleUp,
    'low': faAnglesDown
}

export const issuePriorityTypes = {
    'high': 'high',
    'medium': 'medium',
    'low': 'low'
}

export const issuePriorities = ['high', 'medium', 'low']

export const issuePriorityColor= {
    'high': '#E9494A',
    'medium': '#E97F33',
    'low': '#4FADE6'
}

export const issueStatus = [
    'backlog',
    'selected',
    'inprogress',
    'done'
]

export const IssueStatusEnum = {
    backlog: 'backlog',
    selected: 'selected for development',
    inprogress: 'in progress',
    done: 'done'
}
