import React from 'react'
import styles from './styles.module.scss'
import PropTypes from 'prop-types'

// Deleted Col as we have custom columns
export const Grid = ({children}) => (
    <div className={styles.grid}>
        {children}
    </div>
)

export const Row = ({children, className, noGutters}) => {
    const childrenWithProps = React.Children.map(children, child =>
        React.cloneElement(child, {noGutters: noGutters})
    )
    return (
        <div className={`${styles.row} ${className ? className : ''}`}>
            {childrenWithProps}
        </div>
    )
}

Grid.propTypes = {
    children: PropTypes.node.isRequired
}

Row.propTypes = {
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
    colGutters: PropTypes.number,
    noGutters: PropTypes.bool
}