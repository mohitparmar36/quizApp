import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button, Badge, Card, Modal, Form } from 'react-bootstrap';
import { useTable } from 'react-table';
import { FaEdit, FaEye, FaTrash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './QuizList.css';

const QuizTable = () => {
    const [data, setData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5; 
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal , setShowDeleteModal] = useState(false);

    const [showModal, setShowModal] = useState(false);
    const [newQuiz, setNewQuiz] = useState({
        quizName: '',
        totalMarks: '',
        passingMarks: '',
        expiryDate: '',
        status: 'active',
    });

    const [editQuiz, setEditQuiz] = useState({
        _id: '',
        name: '',
        totalMarks: '',
        passingMarks: '',
        expiryDate: '',
        status: 'active',
    });

    const [renderTrigger, setRenderTrigger] = React.useState(false);


const toggleRender = () => setRenderTrigger((prev) => !prev);



    useEffect(() => {
        axios.get('http://localhost:5000/api/quizzes')
            .then(response => {
                // If the `id` field is missing, assign a temporary id using the index
                const updatedData = (response.data || []).map((item, index) => ({
                    ...item,
                    id: item.id || `${index + 1}` // Assign `temp-<index>` if `id` is missing
                }));
                setData(updatedData);
            })
            .catch(error => console.error("There was an error fetching data:", error));
    }, []);



    const columns = React.useMemo(
        () => [
            { Header: 'ID', accessor: 'id' },
            { Header: 'Quiz Name', accessor: 'name' },
            { Header: 'Total Marks', accessor: 'totalMarks' },
            { Header: 'Passing Marks', accessor: 'passingMarks' },
            { Header: 'Expiry Date', accessor: 'expiryDate' },
            { Header: 'Status', accessor: 'status', Cell: ({ value }) => (
                <Badge bg={value === 'active' ? 'success' : 'danger'}>
                    {value?.toUpperCase()}
                </Badge>
            ) },
            {
                Header: 'Action',
                accessor: 'actions',
                Cell: ({ row }) => (
                    <Badge>hii</Badge>
                )
            }
        ],
        []
    );

    const handleEditClick = (quiz) => {
        setEditQuiz(quiz);
        setShowEditModal(true);
    };

    const handleDelete = async (quiz) => {
        try {
            await axios.delete(`http://localhost:5000/api/quizzes/${quiz._id}`);
            setData((prevData) => prevData.filter((item) => item._id !== quiz._id));
            
        } catch (error) {
            console.error("Failed to delete quiz:", error);
        }
    }

    const tableInstance = useTable({ columns, data });
    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = tableInstance;

    const navigate = useNavigate();
    const handleSuccess = () => {
        console.log("Done")
        navigate('/questionList');
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewQuiz((prev) => ({ ...prev, [name]: value }));
    };

    const handleStatusToggle = () => {
        setNewQuiz((prev) => ({
            ...prev,
            status: prev.status === 'active' ? 'inactive' : 'active',
        }));
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        const newId = data.length + 1;
        const newQuizData = { id: newId, ...newQuiz };

        try {
            const response = await axios.post('http://localhost:5000/api/quizzes', {
                name: newQuizData.quizName,
                totalMarks: newQuizData.totalMarks,
                passingMarks: newQuizData.passingMarks,
                expiryDate: newQuizData.expiryDate,
                status: newQuizData.status,
            });

            setData((prevData) => [...prevData, { id: newId, ...response.data }]);
            setShowModal(false);
            setNewQuiz({
                quizName: '',
                totalMarks: '',
                passingMarks: '',
                expiryDate: '',
                status: 'active',
            });
        } catch (error) {
            console.error("Failed to create quiz:", error);
        }
    };

    // const handleEditClick = () => {
    //     console.log("Edit button clicked for quiz:");
    //     setShowEditModal(true);
    // };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditQuiz((prev) => ({ ...prev, [name]: value }));
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        const quizData = {
            name: editQuiz.name,
            totalMarks: editQuiz.totalMarks,
            passingMarks: editQuiz.passingMarks,
            expiryDate: editQuiz.expiryDate,
            status: editQuiz.status,
        };
    
        try {
            const response = await axios.put(`http://localhost:5000/api/quizzes/${editQuiz._id}`, quizData);
            setData((prevData) => prevData.map((quiz) => (quiz._id === editQuiz._id ? response.data : quiz)));
            setShowEditModal(false);
        } catch (error) {
            console.error("Failed to update quiz:", error);
        }
    };

    const totalPages = Math.ceil(data.length / itemsPerPage);
    const currentData = data.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const nextPage = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    const prevPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    return (
        <>
           <Card className="mx-auto" style={{ maxWidth: '100%', boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)' }}>
                <Card.Header className="d-flex justify-content-between align-items-center" style={{ backgroundColor: '#fff' }}>
                    <h5 className="mb-0 mt-3">Quiz Topics</h5>
                    <Button variant="dark" onClick={() => setShowModal(true)}>Add Quiz</Button>
                </Card.Header>
                <Card.Body>
                    <Table striped bordered hover responsive>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Quiz Name</th>
                                <th>Total Marks</th>
                                <th>Passing Marks</th>
                                <th>Expiry Date</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentData.map((item, index) => (
                                <tr key={item._id || `temp-key-${index}`}>
                                    <td>{index + 1}</td>
                                    <td>{item.name}</td>
                                    <td>{item.totalMarks}</td>
                                    <td>{item.passingMarks}</td>
                                    <td>{item.expiryDate}</td>
                                    <td>
                                        <Badge bg={item.status === 'active' ? 'success' : 'danger'}>
                                            {item.status?.toUpperCase()}
                                        </Badge>
                                    </td>
                                    <td>
                                        <div className="d-flex justify-content-center">
                                            <Button variant="primary" size="sm" className="me-1" onClick={()=>handleEditClick(item)}>
                                                <FaEdit />
                                            </Button>
                                            <Button variant="success" size="sm" className="me-1" onClick={handleSuccess}>
                                                <FaEye />
                                            </Button>
                                            <Button variant="danger" size="sm" onClick={() => handleDelete(item)}>
                                                <FaTrash />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                    <div className="pagination">
                        <Button variant="secondary" onClick={prevPage} disabled={currentPage === 1}>
                            Previous
                        </Button>
                        <span className="mx-3">Page {currentPage} of {totalPages}</span>
                        <Button variant="secondary" onClick={nextPage} disabled={currentPage === totalPages}>
                            Next
                        </Button>
                    </div>
                </Card.Body>
            </Card>

            {/* Add Quiz Modal */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton className="modal-header-red">
                    <Modal.Title>Quiz Form</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleFormSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Quiz Topic</Form.Label>
                            <Form.Control
                                type="text"
                                name="quizName"
                                value={newQuiz.quizName}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Total Marks</Form.Label>
                            <Form.Control
                                type="number"
                                name="totalMarks"
                                value={newQuiz.totalMarks}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Passing Marks</Form.Label>
                            <Form.Control
                                type="number"
                                name="passingMarks"
                                value={newQuiz.passingMarks}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Expiry Date</Form.Label>
                            <Form.Control
                                type="date"
                                name="expiryDate"
                                value={newQuiz.expiryDate}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3 d-flex align-items-center">
                            <Form.Label className="me-3">Status</Form.Label>
                            <Form.Check
                                type="switch"
                                id="status-switch"
                                label={newQuiz.status}
                                checked={newQuiz.status === 'active'}
                                onChange={handleStatusToggle}
                            />
                        </Form.Group>
                        <Button variant="primary" type="submit">
                            Submit
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>

            {/* Edit Quiz Modal */}
            <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Quiz</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleEditSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Quiz Name</Form.Label>
                            <Form.Control
                                type="text"
                                name="name"
                                value={editQuiz.name}
                                onChange={handleEditChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Total Marks</Form.Label>
                            <Form.Control
                                type="number"
                                name="totalMarks"
                                value={editQuiz.totalMarks}
                                onChange={handleEditChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Passing Marks</Form.Label>
                            <Form.Control
                                type="number"
                                name="passingMarks"
                                value={editQuiz.passingMarks}
                                onChange={handleEditChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Expiry Date</Form.Label>
                            <Form.Control
                                type="date"
                                name="expiryDate"
                                value={editQuiz.expiryDate}
                                onChange={handleEditChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Status</Form.Label>
                            <Form.Select
                                name="status"
                                value={editQuiz.status}
                                onChange={handleEditChange}
                                required
                            >
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </Form.Select>
                        </Form.Group>
                        <Button variant="primary" type="submit">
                            Save Changes
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>

        </>
    );
};

export default QuizTable;
