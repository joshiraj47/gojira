import {Pagination} from "react-bootstrap";
import './CustomPagination.css';

export default function CustomPagination({totalPages, currentPage, onPageChange}) {
    let items = [];
    if (currentPage > 1) items.push(<Pagination.Prev key='prev' onClick={() => onPageChange(currentPage - 1)} />);

    for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
        items.push(
            <Pagination.Item key={pageNum} data-page={pageNum}  className='pagination-blue' active={pageNum === currentPage} onClick={() => onPageChange(pageNum)} >
                {pageNum}
            </Pagination.Item>
        );
    }

    if (currentPage < totalPages) items.push(<Pagination.Next key='next' onClick={() => onPageChange(currentPage + 1)} />);

    return (<Pagination>{items}</Pagination>);
}
