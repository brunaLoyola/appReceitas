import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import renderWithRouter from './renderWithRouter';
import Provider from '../context/Provider';
import DoneRecipes from '../pages/DoneRecipes';
import { mockDoneRecipes } from './mocks/mockRecipesMeals';
// import App from '../App';
import DoneRecipesProvider from '../context/DoneRecipesProvider';

describe('Testa o componente Done Recipes', () => {
  it('Testa se renderiza a página Done Recipes', () => {
    renderWithRouter(
      <Provider>
        <DoneRecipesProvider>
          <DoneRecipes />
        </DoneRecipesProvider>
      </Provider>,
    );
    const title = screen.getByTestId('page-title');
    expect(title).toBeInTheDocument();
    const btnAll = screen.getByTestId('filter-by-all-btn');
    expect(btnAll).toBeInTheDocument();
    const btnMeals = screen.getByTestId('filter-by-meal-btn');
    expect(btnMeals).toBeInTheDocument();
    const btnDrink = screen.getByTestId('filter-by-drink-btn');
    expect(btnDrink).toBeInTheDocument();
  });

  it('Testa se a bebida é alcoolica ou não', () => {
    jest.spyOn(global, 'fetch');
    global.fetch.mockResolvedValue({
      json: jest.fn().mockResolvedValue(mockDoneRecipes),
    });
    renderWithRouter(
      <Provider>
        <DoneRecipesProvider>
          <DoneRecipes />
        </DoneRecipesProvider>
      </Provider>,
    );

    const drinkAlcool = screen.getByText(/alcoholic/i);
    expect(drinkAlcool.textContent.length).toBeGreaterThan(0);
  });

  it('Testando o botão de compartilhar', async () => {
    const mockWriteText = jest.fn();
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText: mockWriteText },
    });

    jest.spyOn(global, 'fetch');
    global.fetch.mockResolvedValue({
      json: jest.fn().mockResolvedValue(mockDoneRecipes),
    });
    renderWithRouter(
      <Provider>
        <DoneRecipesProvider>
          <DoneRecipes />
        </DoneRecipesProvider>
      </Provider>,
    );
    const btnShare = await screen.findByTestId('0-horizontal-share-btn');
    expect(btnShare).toBeInTheDocument();
    userEvent.click(btnShare);
    const linkCopied = await screen.findByTestId('link-copied');
    expect(linkCopied).toBeInTheDocument();
  });
  it('Testando os botões de filtro', () => {
    jest.spyOn(global, 'fetch');
    global.fetch.mockResolvedValue({
      json: jest.fn().mockResolvedValue(mockDoneRecipes),
    });
    renderWithRouter(
      <Provider>
        <DoneRecipesProvider>
          <DoneRecipes />
        </DoneRecipesProvider>
      </Provider>,
    );
    const btnMealsFilter = screen.getByTestId('filter-by-meal-btn');
    userEvent.click(btnMealsFilter);
    const nationalityTitle = screen.getByText(/italian/i);
    expect(nationalityTitle).toBeInTheDocument();
    const btnDrinkFIlter = screen.getByTestId('filter-by-drink-btn');
    userEvent.click(btnDrinkFIlter);
    const drinkAlcool = screen.getByRole('heading', { name: /alcoholic/i });
    expect(drinkAlcool).toBeInTheDocument();
    const btnAllFilter = screen.getByTestId('filter-by-all-btn');
    userEvent.click(btnAllFilter);
    const allNationality = screen.getByText(/italian/i);
    expect(allNationality).toBeInTheDocument();
    const allDrink = screen.getByRole('heading', { name: /alcoholic/i });
    expect(allDrink).toBeInTheDocument();
  });
  it('Testando o history', () => {
    const { history } = renderWithRouter(
      <Provider>
        <DoneRecipesProvider>
          <DoneRecipes />
        </DoneRecipesProvider>
      </Provider>,
    );
    const btnRecipeDetails = screen.getByTestId('0-horizontal-name');
    userEvent.click(btnRecipeDetails);

    const { pathname } = history.location;
    expect(pathname).toBe('/meals/52771');
  });
  it('', () => {

  });
});
