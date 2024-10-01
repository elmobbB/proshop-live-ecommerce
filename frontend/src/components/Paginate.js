// import React from 'react'
// import { Pagination } from 'react-bootstrap'
// import { LinkContainer } from 'react-router-bootstrap'

// function Paginate({ pages,page,keyword = '',isAdmin = false }) {

//     console.log(isAdmin,"isadmin?")
//     return (
//         pages > 1 && (
//             <Pagination>
//                 {[...Array(pages).keys()].map((x) => (
//                     <LinkContainer
//                         key={x + 1}
//                         // to={{ pathname: '/',search: `?keyword=${keyword}&page=${x + 1}` }}
//                         to={{
//                             pathname: '/',search: !isAdmin ?
//                                 `/?keyword=${keyword}&page=${x + 1}`
//                                 : `/admin/productlist/?keyword=${keyword}&page=${x + 1}`
//                         }}
//                     >
//                         <Pagination.Item active={x + 1 == page}>{x + 1}</Pagination.Item>
//                     </LinkContainer>
//                 ))
//                 }
//             </Pagination >
//         )
//     )
// }

// export default Paginate
import React from 'react';
import { Pagination } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

function Paginate({ pages,page,keyword = '',isAdmin = false }) {
    return (
        pages > 1 && (
            <Pagination>
                {[...Array(pages).keys()].map((x) => {
                    const pageNumber = x + 1; // Current page number
                    const basePath = isAdmin ? '/admin/productlist' : '/'; // Base path based on isAdmin
                    const searchParams = `?keyword=${keyword}&page=${pageNumber}`; // Query parameters

                    return (
                        <LinkContainer
                            key={pageNumber}
                            to={{
                                pathname: basePath,
                                search: searchParams, // Correctly separated search
                            }}
                        >
                            <Pagination.Item active={pageNumber === page}>{pageNumber}</Pagination.Item>
                        </LinkContainer>
                    );
                })}
            </Pagination>
        )
    );
}

export default Paginate;