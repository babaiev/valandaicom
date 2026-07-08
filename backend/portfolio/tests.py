from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from .models import Skill, Project, Experience
from datetime import date

class PortfolioModelTests(TestCase):
    def test_skill_str(self):
        skill = Skill.objects.create(name="Python", category="Backend")
        self.assertEqual(str(skill), "Python")

    def test_project_str(self):
        project = Project.objects.create(title="My Site", description="Desc")
        self.assertEqual(str(project), "My Site")

    def test_experience_str(self):
        exp = Experience.objects.create(
            company="EPAM", 
            role="Manager", 
            start_date=date(2020, 1, 1),
            description="Doing stuff"
        )
        self.assertEqual(str(exp), "Manager at EPAM")

class PortfolioAPITests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.skill = Skill.objects.create(name="React")
        self.project = Project.objects.create(title="Project A", description="Desc")
        self.project.tech_stack.add(self.skill)
        self.experience = Experience.objects.create(
            company="Google", role="Dev", start_date=date(2022, 1, 1), description="Yes"
        )

    def test_get_skills(self):
        response = self.client.get('/api/portfolio/skills/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['name'], "React")

    def test_get_projects(self):
        response = self.client.get('/api/portfolio/projects/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['title'], "Project A")
        self.assertEqual(response.data[0]['tech_stack'][0]['name'], "React")

    def test_get_experiences(self):
        response = self.client.get('/api/portfolio/experiences/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['company'], "Google")
