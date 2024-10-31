import React, { useEffect, useState, useMemo } from 'react';
import { Table, Button, Badge, Container, Card, Modal, Form } from 'react-bootstrap';
import { useTable, usePagination } from 'react-table';
import { FaEdit, FaTrash } from 'react-icons/fa';
import axios from 'axios';

const QuestionList = () => {
    const [data, setData] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false); 
    const [currentQuestion, setCurrentQuestion] = useState({
        questionText: '',
        optionA: '',
        optionB: '',
        optionC: '',
        optionD: '',
        answer: '',
        id: '', 
    });

    // Fetch questions from the API
    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/quizzes/question');
                setData(response.data); 
            } catch (error) {
                console.error('Error fetching questions:', error);
            }
        };

        fetchQuestions();
    }, []); 

    // Function to add a new question
    const handleAddQuestion = async () => {
        try {
            const response = await axios.post('http://localhost:5000/api/quizzes/question', currentQuestion);
            setData(prevData => [...prevData, response.data]); // Append new question
            resetModal();
        } catch (error) {
            console.error('Error adding question:', error);
        }
    };

    // Function to handle question update
    const handleUpdateQuestion = async () => {
        try {
            const response = await axios.put(`http://localhost:5000/api/quizzes/question/${currentQuestion.id}`, currentQuestion);
            setData(prevData => prevData.map(item => (item._id === currentQuestion.id ? response.data : item))); 
            resetModal();
        } catch (error) {
            console.error('Error updating question:', error);
        }
    };

    // Reset modal state
    const resetModal = () => {
        setShowModal(false);
        setCurrentQuestion({
            questionText: '',
            optionA: '',
            optionB: '',
            optionC: '',
            optionD: '',
            answer: '',
            id: '',
        });
        setIsEditMode(false);
    };

    
    const columns = useMemo(
        () => [
            {
                Header: 'ID',
                accessor: (_, rowIndex) => rowIndex + 1, 
            },
            { Header: 'Question', accessor: 'questionText' },
            { Header: 'Option A', accessor: 'optionA' },
            { Header: 'Option B', accessor: 'optionB' },
            { Header: 'Option C', accessor: 'optionC' },
            { Header: 'Option D', accessor: 'optionD' },
            { Header: 'Answer', accessor: 'answer' },
            {
                Header: 'Action',
                accessor: 'actions',
                Cell: ({ row }) => (
                    <div className="d-flex justify-content-center">
                        <Button variant="primary" size="sm" className="me-1" onClick={() => handleEdit(row.original)}>
                            <FaEdit />
                        </Button>
                        <Button variant="danger" size="sm" onClick={() => handleDelete(row.original._id)}>
                            <FaTrash />
                        </Button>
                    </div>
                )
            }
        ],
        [] 
    );

    const handleEdit = (question) => {
        setCurrentQuestion({
            questionText: question.questionText,
            optionA: question.optionA,
            optionB: question.optionB,
            optionC: question.optionC,
            optionD: question.optionD,
            answer: question.answer,
            id: question._id, 
        });
        setIsEditMode(true);
        setShowModal(true); 
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/api/quizzes/question/${id}`);
            setData(prevData => prevData.filter(item => item._id !== id)); 
        } catch (error) {
            console.error('Error deleting question:', error);
        }
    };

    
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
        state,
        page,
        canPreviousPage,
        canNextPage,
        gotoPage,
        nextPage,
        previousPage,
        setPageSize,
        pageOptions,
    } = useTable(
        {
            columns,
            data: data,
            initialState: { pageIndex: 0, pageSize: 5 } 
        },
        usePagination // Enabled pagination
    );

    return (
        <Container>
            <Card className="mx-auto" style={{ maxWidth: '100%', boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)' }}>
                <Card.Header className="d-flex justify-content-between align-items-center" style={{ backgroundColor: '#fff' }}>
                    <h5 className="mb-0 mt-5">Quiz Questions</h5>
                    <Button variant="dark" onClick={() => setShowModal(true)}>Add Question</Button>
                </Card.Header>
                <Card.Body>
                    <Table {...getTableProps()} striped bordered hover responsive>
                        <thead>
                            {headerGroups.map(headerGroup => (
                                <tr {...headerGroup.getHeaderGroupProps()}>
                                    {headerGroup.headers.map(column => (
                                        <th {...column.getHeaderProps()}>{column.render('Header')}</th>
                                    ))}
                                </tr>
                            ))}
                        </thead>
                        <tbody {...getTableBodyProps()}>
                            {page.map(row => {
                                prepareRow(row);
                                return (
                                    <tr {...row.getRowProps()}>
                                        {row.cells.map(cell => (
                                            <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                                        ))}
                                    </tr>
                                );
                            })}
                        </tbody>
                    </Table>
                   {/* Pagination Controls */}
<div className="d-flex justify-content-between align-items-center mt-3">
    <Button onClick={previousPage} disabled={!canPreviousPage}>Previous</Button>
    <span>
        Page{' '}
        <strong>
            {state.pageIndex + 1} of {pageOptions.length}
        </strong>{' '}
    </span>
    <Button onClick={nextPage} disabled={!canNextPage}>Next</Button>
</div>

                </Card.Body>
            </Card>

            {/* Modal for Adding or Editing Question */}
            <Modal show={showModal} onHide={resetModal}>
                <Modal.Header closeButton>
                    <Modal.Title>{isEditMode ? 'Edit Question' : 'Add New Question'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group>
                            <Form.Label>Question Text</Form.Label>
                            <Form.Control
                                type="text"
                                value={currentQuestion.questionText}
                                onChange={(e) => setCurrentQuestion({ ...currentQuestion, questionText: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Option A</Form.Label>
                            <Form.Control
                                type="text"
                                value={currentQuestion.optionA}
                                onChange={(e) => setCurrentQuestion({ ...currentQuestion, optionA: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Option B</Form.Label>
                            <Form.Control
                                type="text"
                                value={currentQuestion.optionB}
                                onChange={(e) => setCurrentQuestion({ ...currentQuestion, optionB: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Option C</Form.Label>
                            <Form.Control
                                type="text"
                                value={currentQuestion.optionC}
                                onChange={(e) => setCurrentQuestion({ ...currentQuestion, optionC: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Option D</Form.Label>
                            <Form.Control
                                type="text"
                                value={currentQuestion.optionD}
                                onChange={(e) => setCurrentQuestion({ ...currentQuestion, optionD: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Answer</Form.Label>
                            <Form.Control
                                type="text"
                                value={currentQuestion.answer}
                                onChange={(e) => setCurrentQuestion({ ...currentQuestion, answer: e.target.value })}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={resetModal}>Close</Button>
                    <Button variant="primary" onClick={isEditMode ? handleUpdateQuestion : handleAddQuestion}>
                        {isEditMode ? 'Update Question' : 'Add Question'}
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default QuestionList;
